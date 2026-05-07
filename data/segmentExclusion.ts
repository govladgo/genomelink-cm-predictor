import { Segment } from './types';
import { hotspotOverlapFraction, findOverlappingHotspots, IBDHotspot } from './populationIBDRegions';

export interface ScoredSegment {
  index: number;
  cM: number;
  /** 0 = certainly recent-ancestor, 1 = certainly population-inherited */
  populationScore: number;
  /** Fraction of segment overlapping a known IBD hotspot (0-1) */
  hotspotOverlap: number;
  /** Matching hotspot labels (empty if none) */
  hotspotLabels: string[];
}

/**
 * Score each segment for how likely it is to be population-inherited IBD
 * rather than from a recent common ancestor.
 *
 * Scoring factors (each 0-1, combined with weights):
 *   - Size: smaller segments more likely population-level (exponential decay)
 *   - Hotspot overlap: segments in known IBD hotspot regions score higher
 *   - Population floor context: higher floors mean more aggressive scoring
 */
export function scoreSegments(
  segments: Segment[],
  populationId: string,
  populationFloor: number,
): ScoredSegment[] {
  return segments.map((seg, i) => {
    const overlap = hotspotOverlapFraction(
      seg.chromosome, seg.startBp, seg.endBp, populationId,
    );
    const hotspots = findOverlappingHotspots(
      seg.chromosome, seg.startBp, seg.endBp, populationId,
    );

    // Size score: segments < 7 cM are very likely population IBD (30+ generations old).
    // Score decays exponentially as segment size grows.
    // At 7 cM → ~0.6, at 15 cM → ~0.25, at 30 cM → ~0.06, at 50+ cM → ~0.01
    const sizeScore = Math.exp(-seg.cM / 10);

    // Hotspot score: full overlap = 1.0, partial scales linearly
    const hotspotScore = overlap;

    // Combine: hotspot overlap is the strongest signal, size is secondary.
    // If a segment is in a hotspot, that's very informative regardless of size.
    // If no hotspot data, fall back to size heuristic.
    const hasHotspotData = populationId !== 'none';
    const score = hasHotspotData
      ? hotspotScore * 0.6 + sizeScore * 0.4
      : sizeScore;

    return {
      index: i,
      cM: seg.cM,
      populationScore: Math.min(1, score),
      hotspotOverlap: overlap,
      hotspotLabels: hotspots.map((h: IBDHotspot) => h.label),
    };
  });
}

/**
 * Compute default exclusions using region-aware scoring.
 *
 * Strategy: sort segments by populationScore (highest = most likely
 * population-inherited), then greedily exclude until we've removed
 * ~populationFloor worth of cM. Segments with hotspot overlap are
 * prioritized for exclusion over those that are merely small.
 */
export function computeDefaultExclusions(
  segments: Segment[],
  populationFloor: number,
  populationId: string = 'none',
): Set<number> {
  if (populationFloor <= 0 || segments.length < 2) return new Set();

  const scored = scoreSegments(segments, populationId, populationFloor);

  // Sort by score descending — most likely population-IBD first
  const sorted = [...scored].sort((a, b) => b.populationScore - a.populationScore);

  const excluded = new Set<number>();
  let excludedSum = 0;

  for (const item of sorted) {
    if (excludedSum >= populationFloor) break;
    // Only exclude segments that score above a minimum threshold (0.1).
    // This prevents excluding large, clearly-recent-ancestor segments
    // just to fill the floor quota.
    if (item.populationScore < 0.1) break;
    excluded.add(item.index);
    excludedSum += item.cM;
  }

  // Never exclude all segments
  if (excluded.size === segments.length && segments.length > 0) {
    const largest = sorted[sorted.length - 1];
    excluded.delete(largest.index);
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
