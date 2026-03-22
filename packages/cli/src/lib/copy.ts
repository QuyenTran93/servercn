import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import type { AddOptions, CopyOptions, RegistryItem } from "@/types";
import { findFilesByPath } from "@/utils/file";
import { normalizeEol } from "@/utils/normalize-eol";
import {
  applyMarkerMerge,
  isMergeOnlyFragment
} from "@/lib/merge-marker";

//? development mode
export async function copyTemplate({
  templateDir,
  targetDir,
  registryItemName,
  conflict = "skip",
  dryRun = false,
  merge = false
}: CopyOptions) {
  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);

    const rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;

    const finalName = rawName;
    const destPath = path.join(targetDir, finalName);
    const relativeDestPath = path.relative(process.cwd(), destPath);
    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        registryItemName,
        conflict,
        dryRun,
        merge
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists) {
      if (conflict === "skip") {
        if (merge && registryItemName) {
          const peek = await fs.readFile(srcPath);
          if (!peek.includes(0)) {
            const srcText = normalizeEol(peek.toString("utf8"));
            if (isMergeOnlyFragment(srcText, registryItemName)) {
              const destText = normalizeEol(
                await fs.readFile(destPath, "utf8")
              );
              const merged = applyMarkerMerge(
                destText,
                srcText,
                registryItemName
              );
              if (!merged.ok) {
                logger.error(
                  `Merge failed for ${relativeDestPath}: destination is missing // @servercn:begin/end ${registryItemName} markers. Add them or use --force.`
                );
                process.exit(1);
              }
              if (!dryRun) {
                await fs.writeFile(destPath, merged.content, "utf8");
                logger.info(`MERGE: ${relativeDestPath}`);
              } else {
                logger.info(`[dry-run] merge: ${relativeDestPath}`);
              }
              continue;
            }
          }
        }
        logger.skip(relativeDestPath);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${relativeDestPath}`);
      }
    }

    if (dryRun) {
      logger.info(
        `[dry-run] ${exists ? "overwrite" : "create"}: ${relativeDestPath}`
      );
      continue;
    }

    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);

    if (
      !exists &&
      !isBinary &&
      merge &&
      registryItemName &&
      isMergeOnlyFragment(normalizeEol(buffer.toString("utf8")), registryItemName)
    ) {
      logger.muted(
        `SKIP (merge-only fragment, target missing): ${relativeDestPath}`
      );
      continue;
    }

    await fs.ensureDir(path.dirname(destPath));

    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      const content = normalizeEol(buffer.toString("utf8"));

      await fs.writeFile(destPath, content, "utf8");
    }

    if (exists) {
      logger.overwrite(relativeDestPath);
    } else {
      logger.create(relativeDestPath);
    }
  }
}

//? production mode
export async function cloneServercnRegistry({
  component,
  templatePath,
  targetDir,
  selectedProvider,
  options
}: {
  component: RegistryItem;
  templatePath: string;
  targetDir: string;
  selectedProvider?: string;
  options: AddOptions;
}): Promise<boolean> {
  logger.break();
  try {
    const files = findFilesByPath(component, templatePath, selectedProvider);
    if (!files || files.length === 0) {
      return false;
    }

    const slug =
      "slug" in component && typeof component.slug === "string"
        ? component.slug
        : "";

    const useMerge = Boolean(options.merge && !options.force && slug);

    for (const file of files) {
      const destPath = path.join(targetDir, file.path);
      const exists = await fs.pathExists(destPath);
      const templateContent = normalizeEol(file.content);

      if (options.force) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, templateContent, "utf8");
        if (exists) {
          logger.overwrite(file.path);
        } else {
          logger.create(file.path);
        }
        continue;
      }

      if (useMerge && isMergeOnlyFragment(templateContent, slug)) {
        if (!exists) {
          logger.muted(
            `SKIP (merge-only fragment, target missing): ${file.path}`
          );
          continue;
        }
        const destText = normalizeEol(await fs.readFile(destPath, "utf8"));
        const merged = applyMarkerMerge(destText, templateContent, slug);
        if (!merged.ok) {
          logger.error(
            `Merge failed for ${file.path}: destination is missing // @servercn:begin/end ${slug} markers. Add them or use --force.`
          );
          process.exit(1);
        }
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, merged.content, "utf8");
        logger.info(`MERGE: ${file.path}`);
        continue;
      }

      if (exists) {
        logger.skip(file.path);
        continue;
      }

      await fs.ensureDir(path.dirname(destPath));
      await fs.writeFile(destPath, templateContent, "utf8");
      logger.create(file.path);
    }
    return true;
  } catch {
    return false;
  }
}
