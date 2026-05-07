import { Segment } from './types';

export function computeDefaultExclusions(
  segments: Segment[],
  populationFloor: number,
): Set<number> {
  if (populationFloor <= 0 || segments.length < 2) return new Set();

  const indexed = segments.map((s, i) => ({ index: i, cM: s.cM }));
  indexed.sort((a, b) => a.cM - b.cM);

  const excluded = new Set<number>();
  let excludedSum = 0;

  for (const item of indexed) {
    if (excludedSum >= populationFloor) break;
    excluded.add(item.index);
    excludedSum += item.cM;
  }

  if (excluded.size === segments.length && segments.length > 0) {
    const largestIdx = indexed[indexed.length - 1].index;
    excluded.delete(largestIdx);
  }

  return excluded;
}

export function computeEffectiveCM(
  segments: Segment[],
  excludedIndices: Set<number>,
): number {
  return segments.reduce(
    (sum, seg, i) => (excludedIndices.has(i) ? sum : sum + seg.cM),
    0,
  );
}
