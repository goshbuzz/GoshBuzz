// Helpers that keep <title> and meta description inside the lengths search
// engines actually display (~60 / ~155 chars) without cutting mid-word.

export function clampDescription(text: string, max = 155): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  // Prefer ending on a full sentence if one finishes late enough in the slice.
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (sentenceEnd >= max * 0.6) return slice.slice(0, sentenceEnd + 1);
  const wordEnd = slice.lastIndexOf(' ');
  const cut = (wordEnd > 0 ? slice.slice(0, wordEnd) : slice).replace(/[\s,;:\-—–]+$/, '');
  return `${cut}…`;
}

/** Return the first candidate that fits in `max` chars (last candidate is the fallback). */
export function pickTitle(candidates: string[], max = 60): string {
  for (const c of candidates) if (c.length <= max) return c;
  return candidates[candidates.length - 1];
}
