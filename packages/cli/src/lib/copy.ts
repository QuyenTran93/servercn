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
import {
  EXPRESS_MERGE_CRITICAL_PATHS,
  resolveExpressMergeMarkerIds,
  type ExpressMergeSlug
} from "@/constants/express-merge-slots";

function detectMergeMarkerId(
  templateContent: string,
  markerIds: readonly ExpressMergeSlug[]
): ExpressMergeSlug | null {
  for (const markerId of markerIds) {
    if (isMergeOnlyFragment(templateContent, markerId)) {
      return markerId;
    }
  }
  return null;
}

function markerErrorHint(registryItemName: string): string {
  if (registryItemName === "oauth") {
    return " Legacy projects with // @servercn:begin oauth must migrate to oauth-google/oauth-github markers (warn-only policy).";
  }
  return "";
}

function isCriticalMergePath(
  componentSlug: string,
  filePath: string
): boolean {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const criticalPaths =
    EXPRESS_MERGE_CRITICAL_PATHS[
      componentSlug as keyof typeof EXPRESS_MERGE_CRITICAL_PATHS
    ] ?? [];
  return criticalPaths.some(p => normalizedPath.endsWith(p));
}

function getOAuthVariantEnvFragment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any,
  filePath: string,
  variant: "google" | "github"
): string | null {
  const variantArch = component?.runtimes?.node?.frameworks?.express?.variants?.[
    variant
  ]?.architectures;
  if (!variantArch) return null;
  const architecture = filePath.includes("/shared/configs/") ? "feature" : "mvc";
  const files = variantArch[architecture]?.files;
  if (!Array.isArray(files)) return null;
  const matched = files.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) => typeof f?.path === "string" && f.path === filePath
  );
  return typeof matched?.content === "string"
    ? normalizeEol(matched.content)
    : null;
}

//? development mode
export async function copyTemplate({
  templateDir,
  targetDir,
  registryItemName,
  selectedProvider,
  conflict = "skip",
  dryRun = false,
  merge = false
}: CopyOptions) {
  await fs.ensureDir(targetDir);
  const baseRegistrySlug = registryItemName.includes("/")
    ? (registryItemName.split("/").shift() ?? registryItemName)
    : registryItemName;
  const mergeMarkerIds = resolveExpressMergeMarkerIds(
    baseRegistrySlug,
    selectedProvider
  );

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
        selectedProvider,
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
            const markerId = detectMergeMarkerId(srcText, mergeMarkerIds);
            if (markerId) {
              const destText = normalizeEol(
                await fs.readFile(destPath, "utf8")
              );
              const merged = applyMarkerMerge(destText, srcText, markerId);
              if (!merged.ok) {
                logger.error(
                  `Merge failed for ${relativeDestPath}: destination is missing // @servercn:begin/end ${markerId} markers. Add them or use --force.${markerErrorHint(baseRegistrySlug)}`
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
            const normalizedRel = relativeDestPath.replace(/\\/g, "/");
            if (
              mergeMarkerIds.length > 0 &&
              isCriticalMergePath(baseRegistrySlug, normalizedRel)
            ) {
              logger.error(
                `Merge failed for ${relativeDestPath}: ${baseRegistrySlug} template at this merge-critical path must be a merge-only fragment (${mergeMarkerIds.join(", ")}). Refusing silent skip; use --force only if you accept overwrite.`
              );
              process.exit(1);
            }
            if (
              mergeMarkerIds.length > 0 &&
              normalizedRel.endsWith("configs/env.ts") &&
              exists
            ) {
              if (baseRegistrySlug === "oauth") {
                const destText = normalizeEol(
                  await fs.readFile(destPath, "utf8")
                );
                const hasProviderMarkers =
                  destText.includes("// @servercn:begin oauth-google") &&
                  destText.includes("// @servercn:begin oauth-github");
                logger.error(
                  hasProviderMarkers
                    ? `Merge failed for ${relativeDestPath}: source OAuth env template is not a merge-only provider fragment for the selected variant.`
                    : `Merge failed for ${relativeDestPath}: destination is missing provider markers oauth-google/oauth-github.${markerErrorHint(baseRegistrySlug)}`
                );
                process.exit(1);
              }
              if (
                baseRegistrySlug === "rbac" ||
                baseRegistrySlug === "jwt-utils" ||
                baseRegistrySlug === "file-upload"
              ) {
                logger.error(
                  `Merge failed for ${relativeDestPath}: env template must be a merge-only fragment for: ${mergeMarkerIds.join(", ")}.`
                );
                process.exit(1);
              }
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
      detectMergeMarkerId(normalizeEol(buffer.toString("utf8")), mergeMarkerIds)
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
    const mergeMarkerIds = resolveExpressMergeMarkerIds(slug, selectedProvider);

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

      const isOAuthCompositeEnvMerge =
        useMerge &&
        slug === "oauth" &&
        selectedProvider === "google-github" &&
        file.path.endsWith("configs/env.ts");
      if (isOAuthCompositeEnvMerge) {
        if (!exists) {
          logger.muted(
            `SKIP (merge-only fragment, target missing): ${file.path}`
          );
          continue;
        }
        let mergedText = normalizeEol(await fs.readFile(destPath, "utf8"));
        for (const variant of ["google", "github"] as const) {
          const markerId = resolveExpressMergeMarkerIds("oauth", variant)[0];
          const variantFragment = getOAuthVariantEnvFragment(
            component,
            file.path,
            variant
          );
          if (!variantFragment || !markerId) {
            logger.error(
              `Merge failed for ${file.path}: could not resolve ${variant} env fragment for composite OAuth merge.`
            );
            process.exit(1);
          }
          if (!isMergeOnlyFragment(variantFragment, markerId)) {
            logger.error(
              `Merge failed for ${file.path}: ${variant} env template must be a merge-only fragment using ${markerId}.`
            );
            process.exit(1);
          }
          const merged = applyMarkerMerge(mergedText, variantFragment, markerId);
          if (!merged.ok) {
            logger.error(
              `Merge failed for ${file.path}: destination is missing // @servercn:begin/end ${markerId} markers. Add them or use --force.${markerErrorHint("oauth")}`
            );
            process.exit(1);
          }
          mergedText = merged.content;
        }
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, mergedText, "utf8");
        logger.info(`MERGE: ${file.path}`);
        continue;
      }

      const markerId = detectMergeMarkerId(templateContent, mergeMarkerIds);
      if (useMerge && markerId) {
        if (!exists) {
          logger.muted(
            `SKIP (merge-only fragment, target missing): ${file.path}`
          );
          continue;
        }
        const destText = normalizeEol(await fs.readFile(destPath, "utf8"));
        const merged = applyMarkerMerge(destText, templateContent, markerId);
        if (!merged.ok) {
          logger.error(
            `Merge failed for ${file.path}: destination is missing // @servercn:begin/end ${markerId} markers. Add them or use --force.${markerErrorHint(slug)}`
          );
          process.exit(1);
        }
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, merged.content, "utf8");
        logger.info(`MERGE: ${file.path}`);
        continue;
      }

      // Env merge must never silently fall back to skip when --merge is requested and a marker id is expected.
      if (
        useMerge &&
        mergeMarkerIds.length > 0 &&
        isCriticalMergePath(slug, file.path) &&
        exists &&
        !detectMergeMarkerId(templateContent, mergeMarkerIds)
      ) {
        logger.error(
          `Merge failed for ${file.path}: ${slug} template at this merge-critical path must be a merge-only fragment (${mergeMarkerIds.join(", ")}). Refusing silent skip; use --force only if you accept overwrite.`
        );
        process.exit(1);
      }

      // Env merge must never silently fall back to skip when --merge is requested and a marker id is expected.
      if (
        useMerge &&
        mergeMarkerIds.length > 0 &&
        file.path.endsWith("configs/env.ts") &&
        exists &&
        !detectMergeMarkerId(templateContent, mergeMarkerIds)
      ) {
        if (slug === "oauth") {
          const destText = normalizeEol(await fs.readFile(destPath, "utf8"));
          const hasProviderMarkers =
            destText.includes("// @servercn:begin oauth-google") &&
            destText.includes("// @servercn:begin oauth-github");
          logger.error(
            hasProviderMarkers
              ? `Merge failed for ${file.path}: source OAuth env template is not a merge-only provider fragment for the selected variant. This usually means registry/templates are out of sync. Use local templates (\`--local\`) or update registry build.`
              : `Merge failed for ${file.path}: destination is missing provider markers oauth-google/oauth-github.${markerErrorHint(slug)}`
          );
          process.exit(1);
        }
        if (
          slug === "rbac" ||
          slug === "jwt-utils" ||
          slug === "file-upload"
        ) {
          logger.error(
            `Merge failed for ${file.path}: env template must be a merge-only fragment for: ${mergeMarkerIds.join(", ")}.`
          );
          process.exit(1);
        }
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
