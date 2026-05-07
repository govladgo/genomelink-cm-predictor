/**
 * Known IBD hotspot regions per population — chromosomal regions where
 * members of endogamous populations commonly share identical-by-descent
 * segments from ancient common ancestry rather than recent relationships.
 *
 * Sources:
 *   - Gusev et al. 2012 (MBE 29:473-486) — 14 AJ excess-IBD regions
 *   - Li et al. 2014 (HMG 23:4693-4702) — AJ IBD mapping
 *   - Carmi et al. 2014 (Nature Comms 5:4835) — AJ bottleneck confirmation
 *   - Bherer et al. 2013 (EJHG, PMC4023206) — French Canadian IBD
 *   - Bray/Ostrer 2010 (PNAS 107:16222) — AJ selection signals
 *
 * Coordinates are hg38 (GRCh38). Confidence tiers:
 *   high   — published in peer-reviewed literature with coordinate data
 *   medium — documented in multiple community/genealogy sources
 *   low    — inferred from population genetics principles
 */

export interface IBDHotspot {
  id: string;
  chromosome: number;
  startBp: number;
  endBp: number;
  label: string;
  /** Why this region is an IBD hotspot */
  mechanism: 'balancing_selection' | 'founder_haplotype' | 'low_recombination' | 'selection_signal';
  confidence: 'high' | 'medium' | 'low';
  /** Which populations this hotspot is relevant to ('all' = every endogamous population) */
  populations: string[];
}

// ============================================================================
// Universal hotspots (all endogamous populations)
// ============================================================================

const UNIVERSAL_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'HLA',
    chromosome: 6,
    startBp: 25_000_000,
    endBp: 35_000_000,
    label: 'HLA / MHC region',
    mechanism: 'balancing_selection',
    confidence: 'high',
    populations: ['all'],
  },
  {
    id: 'CHR9_PERI',
    chromosome: 9,
    startBp: 28_000_000,
    endBp: 70_000_000,
    label: 'Chr 9 pericentromeric',
    mechanism: 'low_recombination',
    confidence: 'medium',
    populations: ['all'],
  },
  {
    id: 'CHR1_PERI',
    chromosome: 1,
    startBp: 120_000_000,
    endBp: 145_000_000,
    label: 'Chr 1 pericentromeric',
    mechanism: 'low_recombination',
    confidence: 'medium',
    populations: ['all'],
  },
  {
    id: 'CHR16_PERI',
    chromosome: 16,
    startBp: 34_000_000,
    endBp: 47_000_000,
    label: 'Chr 16 pericentromeric',
    mechanism: 'low_recombination',
    confidence: 'medium',
    populations: ['all'],
  },
];

// ============================================================================
// Ashkenazi Jewish — most extensively mapped (Gusev 2012, Li 2014)
// ============================================================================

const ASHKENAZI_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'AJ_CHR2Q14',
    chromosome: 2,
    startBp: 121_000_000,
    endBp: 140_000_000,
    label: 'Chr 2q14-q22 AJ haplotype',
    mechanism: 'founder_haplotype',
    confidence: 'high',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHR10',
    chromosome: 10,
    startBp: 16_000_000,
    endBp: 68_000_000,
    label: 'Chr 10 AJ excess sharing',
    mechanism: 'founder_haplotype',
    confidence: 'high',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHR11',
    chromosome: 11,
    startBp: 60_000_000,
    endBp: 91_000_000,
    label: 'Chr 11 AJ pile-up',
    mechanism: 'founder_haplotype',
    confidence: 'high',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHR12',
    chromosome: 12,
    startBp: 110_000_000,
    endBp: 113_000_000,
    label: 'Chr 12 AJ selection signal',
    mechanism: 'selection_signal',
    confidence: 'high',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHR19',
    chromosome: 19,
    startBp: 1_000_000,
    endBp: 20_000_000,
    label: 'Chr 19 AJ excess sharing',
    mechanism: 'founder_haplotype',
    confidence: 'medium',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHR21',
    chromosome: 21,
    startBp: 22_000_000,
    endBp: 32_000_000,
    label: 'Chr 21 AJ pile-up',
    mechanism: 'founder_haplotype',
    confidence: 'high',
    populations: ['ashkenazi'],
  },
  {
    id: 'AJ_CHRX',
    chromosome: 23,
    startBp: 91_000_000,
    endBp: 139_000_000,
    label: 'Chr X AJ excess sharing',
    mechanism: 'founder_haplotype',
    confidence: 'medium',
    populations: ['ashkenazi'],
  },
];

// ============================================================================
// French Canadian / Acadian (Bherer 2013)
// ============================================================================

const ACADIAN_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'AC_CHR3',
    chromosome: 3,
    startBp: 45_000_000,
    endBp: 75_000_000,
    label: 'Chr 3 Quebec founder haplotype',
    mechanism: 'founder_haplotype',
    confidence: 'medium',
    populations: ['acadian_quebec'],
  },
  {
    id: 'AC_CHR5',
    chromosome: 5,
    startBp: 10_000_000,
    endBp: 35_000_000,
    label: 'Chr 5 Acadian founder region',
    mechanism: 'founder_haplotype',
    confidence: 'medium',
    populations: ['acadian_quebec'],
  },
  {
    id: 'AC_CHR15',
    chromosome: 15,
    startBp: 20_000_000,
    endBp: 42_000_000,
    label: 'Chr 15 Quebec excess sharing',
    mechanism: 'founder_haplotype',
    confidence: 'medium',
    populations: ['acadian_quebec'],
  },
];

// ============================================================================
// Other populations — fewer published region-level data
// ============================================================================

const MENNONITE_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'MN_CHR2',
    chromosome: 2,
    startBp: 200_000_000,
    endBp: 230_000_000,
    label: 'Chr 2 Anabaptist founder haplotype',
    mechanism: 'founder_haplotype',
    confidence: 'low',
    populations: ['mennonite_amish'],
  },
  {
    id: 'MN_CHR7',
    chromosome: 7,
    startBp: 55_000_000,
    endBp: 80_000_000,
    label: 'Chr 7 Mennonite excess sharing',
    mechanism: 'founder_haplotype',
    confidence: 'low',
    populations: ['mennonite_amish'],
  },
];

const ICELANDIC_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'IC_CHR8',
    chromosome: 8,
    startBp: 1_000_000,
    endBp: 25_000_000,
    label: 'Chr 8 Norse founder haplotype',
    mechanism: 'founder_haplotype',
    confidence: 'low',
    populations: ['icelandic'],
  },
];

const BALTIC_HOTSPOTS: IBDHotspot[] = [
  {
    id: 'BS_CHR4',
    chromosome: 4,
    startBp: 30_000_000,
    endBp: 60_000_000,
    label: 'Chr 4 Commonwealth-era haplotype',
    mechanism: 'founder_haplotype',
    confidence: 'low',
    populations: ['baltic_slavic'],
  },
];

// ============================================================================
// Combined catalog + lookup
// ============================================================================

export const ALL_IBD_HOTSPOTS: IBDHotspot[] = [
  ...UNIVERSAL_HOTSPOTS,
  ...ASHKENAZI_HOTSPOTS,
  ...ACADIAN_HOTSPOTS,
  ...MENNONITE_HOTSPOTS,
  ...ICELANDIC_HOTSPOTS,
  ...BALTIC_HOTSPOTS,
];

/**
 * Get hotspots relevant to a population (universal + population-specific).
 */
export function getHotspotsForPopulation(populationId: string): IBDHotspot[] {
  if (populationId === 'none') return [];
  return ALL_IBD_HOTSPOTS.filter(
    (h) => h.populations.includes('all') || h.populations.includes(populationId),
  );
}

/**
 * Check whether a segment overlaps any hotspot region for a population.
 * Returns the matching hotspot(s), or empty array.
 */
export function findOverlappingHotspots(
  chromosome: number,
  startBp: number,
  endBp: number,
  populationId: string,
): IBDHotspot[] {
  const hotspots = getHotspotsForPopulation(populationId);
  return hotspots.filter(
    (h) =>
      h.chromosome === chromosome &&
      startBp < h.endBp &&
      endBp > h.startBp,
  );
}

/**
 * Compute what fraction of a segment overlaps with hotspot regions.
 * Returns 0-1 (0 = no overlap, 1 = fully within a hotspot).
 */
export function hotspotOverlapFraction(
  chromosome: number,
  startBp: number,
  endBp: number,
  populationId: string,
): number {
  const segLen = endBp - startBp;
  if (segLen <= 0) return 0;

  const hotspots = findOverlappingHotspots(chromosome, startBp, endBp, populationId);
  if (hotspots.length === 0) return 0;

  let overlapBp = 0;
  for (const h of hotspots) {
    const oStart = Math.max(startBp, h.startBp);
    const oEnd = Math.min(endBp, h.endBp);
    if (oEnd > oStart) overlapBp += oEnd - oStart;
  }

  return Math.min(1, overlapBp / segLen);
}
