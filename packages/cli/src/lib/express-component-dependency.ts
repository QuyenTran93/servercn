import fs from "fs-extra";
import path from "node:path";
import type { Architecture } from "@/types";
import {
  EXPRESS_DEPENDENCY_RULE_SLUGS,
  getExpressDependencySentinelPaths,
  type ExpressDependencyRuleSlug
} from "@/constants/express-component-dependency-rules";

export async function detectInstalledExpressDependencySlugs(
  projectRoot: string,
  arch: Architecture
): Promise<Set<ExpressDependencyRuleSlug>> {
  const sentinels = getExpressDependencySentinelPaths(arch);
  const installed = new Set<ExpressDependencyRuleSlug>();
  for (const slug of EXPRESS_DEPENDENCY_RULE_SLUGS) {
    for (const relPath of sentinels[slug]) {
      const absPath = path.join(projectRoot, ...relPath.split("/"));
      if (await fs.pathExists(absPath)) {
        installed.add(slug);
        break;
      }
    }
  }
  return installed;
}

