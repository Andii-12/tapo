/** Cut copy mid-thought so unpaid users see a teaser, not the full answer. */
export function teaseText(full: string, maxLen = 160): string {
  const clean = full.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  const target = Math.min(
    maxLen,
    Math.max(100, Math.floor(clean.length * 0.38))
  );

  if (clean.length <= target + 30) {
    const soft = Math.min(130, Math.max(75, Math.floor(clean.length * 0.55)));
    const slice = clean.slice(0, soft);
    const space = slice.lastIndexOf(" ");
    const cut = space > 40 ? slice.slice(0, space) : slice;
    return `${cut.replace(/[.,;:!?…]+$/u, "")}… Гэсэн ч`;
  }

  const slice = clean.slice(0, target);
  const space = slice.lastIndexOf(" ");
  const cut = space > target * 0.5 ? slice.slice(0, space) : slice;

  return `${cut.replace(/[.,;:!?…]+$/u, "")}… Гэсэн ч`;
}
