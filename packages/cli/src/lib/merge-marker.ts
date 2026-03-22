import { normalizeEol } from "@/utils/normalize-eol";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function markerBeginLine(slug: string): string {
  return `// @servercn:begin ${slug}`;
}

export function markerEndLine(slug: string): string {
  return `// @servercn:end ${slug}`;
}

/**
 * True when the template file is only a begin/end pair for this slug (merge fragment).
 */
export function isMergeOnlyFragment(content: string, slug: string): boolean {
  const n = normalizeEol(content).trim();
  const begin = markerBeginLine(slug);
  const end = markerEndLine(slug);
  if (!n.startsWith(`${begin}\n`) || !n.endsWith(end)) {
    return false;
  }
  const inner = n.slice(begin.length + 1, n.length - end.length).trimEnd();
  return !inner.includes("\n// @servercn:begin ");
}

/**
 * Extract inner lines between servercn markers in template (trimmed body, no boundary lines).
 */
export function extractMarkerInner(
  content: string,
  slug: string
): string | null {
  const n = normalizeEol(content).trim();
  const begin = markerBeginLine(slug);
  const end = markerEndLine(slug);
  const re = new RegExp(
    `^${escapeRegExp(begin)}\\s*\\n([\\s\\S]*?)\\n${escapeRegExp(end)}\\s*$`
  );
  const m = n.match(re);
  return m ? m[1] : null;
}

export type MarkerMergeResult =
  | { ok: true; content: string }
  | { ok: false; reason: "missing_marker_in_dest" | "missing_marker_in_template" };

/**
 * Replace the region between markers in `dest` with the inner region from `template`.
 * Both files must use the same slug in marker lines.
 */
export function applyMarkerMerge(
  dest: string,
  template: string,
  slug: string
): MarkerMergeResult {
  const inner = extractMarkerInner(template, slug);
  if (inner === null) {
    return { ok: false, reason: "missing_marker_in_template" };
  }
  const normalizedDest = normalizeEol(dest);
  const begin = markerBeginLine(slug);
  const end = markerEndLine(slug);
  const blockRe = new RegExp(
    `${escapeRegExp(begin)}\\s*\\n([\\s\\S]*?)\\n${escapeRegExp(end)}`,
    "m"
  );
  if (!blockRe.test(normalizedDest)) {
    return { ok: false, reason: "missing_marker_in_dest" };
  }
  const next = normalizedDest.replace(
    blockRe,
    `${begin}\n${inner}\n${end}`
  );
  return { ok: true, content: next };
}
