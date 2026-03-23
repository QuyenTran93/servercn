/** Normalize text to LF for scaffolded files and embedded registry content. */
export function normalizeEol(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
