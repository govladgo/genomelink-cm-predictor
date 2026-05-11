/**
 * cM Clarity — population-context reference data.
 *
 * For populations with significant historical endogamy or shared ancestry,
 * two unrelated members can share substantial DNA simply by virtue of belonging
 * to that population. This file captures, per population:
 *
 *   - sharedPopulationFloor: cM that any two random members of this population
 *     share by population-level common ancestry alone (subtract this from
 *     observed cM before predicting the recent-relationship range)
 *   - per-relationship cM brackets: the typical observed cM range for each
 *     relationship class WITHIN the population (raw-shared, not floor-adjusted)
 *   - narrative: short historical context to explain why the population shares
 *     extra DNA
 *
 * Sources: literature on endogamy and population genetics (Acadian studies,
 * Ashkenazi bottleneck research, Polish-Lithuanian Commonwealth historical
 * demography, etc.). Numbers in v1 are approximations — flagged in UI as such.
 */

import { SharedCmEntryV4, AncestryComponent } from './types';

// ============================================================================
// Population context type
// ============================================================================

export interface PopulationContext {
  id: string;
  /** UI label */
  label: string;
  /** Era / historical period for the narrative */
  era: string;
  /** 2-3 sentence historical explanation */
  narrative: string;
  /** Regions associated with this population (matches ancestryProfile.region) */
  associatedRegions: string[];
  /** Concrete example of the kind of match this affects */
  exampleMatchPattern: string;
  /** cM that two random members share from population-level ancestry alone */
  sharedPopulationFloor: number;
  /**
   * Legacy multiplier compat — for callers that just want a single number.
   * 1.0 = no inflation. Higher = more inflation.
   */
  endogamyEquivalent: number;
  /**
   * Per-relationship cM range overrides for this population. Only relationships
   * with notable shifts from baseline are listed; others fall through to the
   * standard `sharedCmData` table.
   */
  cmAdjustments?: Partial<Record<string, { minCM: number; maxCM: number; avgCM: number }>>;
}

// ============================================================================
// Population catalog
// ============================================================================

export const POPULATION_CONTEXTS: PopulationContext[] = [
  {
    id: 'none',
    label: 'None / Outbred',
    era: '',
    narrative:
      'No notable population-level shared ancestry. Use this for matches whose ancestry comes from large outbred populations with no recent population bottleneck or sustained intermixing.',
    associatedRegions: [],
    exampleMatchPattern: '',
    sharedPopulationFloor: 0,
    endogamyEquivalent: 1.0,
  },
  {
    id: 'baltic_slavic',
    label: 'Baltic / Slavic',
    era: 'Polish-Lithuanian Commonwealth (1569–1795)',
    narrative:
      'For ~230 years, Poland and Lithuania shared a multi-ethnic state with substantial population mixing across modern Polish, Lithuanian, Belarusian, and Ukrainian borders. Two unrelated people from this region today often share 10–40 cM purely from this shared past.',
    associatedRegions: ['Eastern European', 'Baltic'],
    exampleMatchPattern:
      'A Polish person in Warsaw and a Lithuanian in Vilnius sharing 60 cM may be 5th–6th cousins, with ~25 cM coming from shared Commonwealth-era ancestry rather than a recent common ancestor.',
    sharedPopulationFloor: 25,
    endogamyEquivalent: 1.15,
    cmAdjustments: {
      '3rd cousin': { minCM: 25, maxCM: 280, avgCM: 100 },
      '4th cousin': { minCM: 15, maxCM: 200, avgCM: 60 },
      '5th cousin': { minCM: 12, maxCM: 160, avgCM: 40 },
    },
  },
  {
    id: 'ashkenazi',
    label: 'Ashkenazi Jewish',
    era: 'Pale of Settlement (1791–1917) and earlier',
    narrative:
      'Ashkenazi populations experienced a severe bottleneck ~600–800 years ago, leaving descendants with substantial shared DNA. Two unrelated Ashkenazi Jews typically share 50–150 cM from common ancestry that predates verifiable genealogical relationships.',
    associatedRegions: ['Ashkenazi Jewish'],
    exampleMatchPattern:
      'Two Ashkenazi-descended matches sharing 100 cM may share no documentable ancestor at all — most of that cM (~80) comes from population-wide bottleneck history.',
    sharedPopulationFloor: 80,
    endogamyEquivalent: 1.5,
    cmAdjustments: {
      '3rd cousin': { minCM: 100, maxCM: 400, avgCM: 200 },
      '4th cousin': { minCM: 80, maxCM: 280, avgCM: 130 },
      '5th cousin': { minCM: 70, maxCM: 220, avgCM: 100 },
      '6th cousin': { minCM: 65, maxCM: 180, avgCM: 90 },
    },
  },
  {
    id: 'iberian_latam',
    label: 'Iberian / Latin American Colonial',
    era: 'Spanish & Portuguese Colonization (1500s–1800s)',
    narrative:
      'Spanish and Portuguese colonization created tightly-mixed populations across Latin America from a relatively small founder population, often with sustained intermarriage between settler families. Two unrelated Latin Americans of colonial Iberian descent often share 30–70 cM from this shared past.',
    associatedRegions: ['Iberian / Latin American'],
    exampleMatchPattern:
      'A Mexican-American and a Colombian both descended from colonial Iberian settlers sharing 180 cM may be 4th–5th cousins, not 3rd.',
    sharedPopulationFloor: 40,
    endogamyEquivalent: 1.25,
    cmAdjustments: {
      '3rd cousin': { minCM: 50, maxCM: 320, avgCM: 130 },
      '4th cousin': { minCM: 35, maxCM: 220, avgCM: 80 },
      '5th cousin': { minCM: 30, maxCM: 180, avgCM: 60 },
    },
  },
  {
    id: 'acadian_quebec',
    label: 'Acadian / Quebec French',
    era: 'New France (1604–1763) and Acadian diaspora',
    narrative:
      'The French settler population of New France (Quebec, Acadia) descends from a relatively small founder group of ~10,000 immigrants, with extensive intermarriage over 400+ years. Modern descendants often share 100+ cM with unrelated Quebec/Acadian-descended matches.',
    associatedRegions: ['British & Irish'],
    exampleMatchPattern:
      'Two people whose ancestors lived in 18th-century Quebec sharing 250 cM are typically 5th–6th cousins, not 4th cousins.',
    sharedPopulationFloor: 90,
    endogamyEquivalent: 1.55,
    cmAdjustments: {
      '4th cousin': { minCM: 90, maxCM: 280, avgCM: 140 },
      '5th cousin': { minCM: 80, maxCM: 220, avgCM: 110 },
      '6th cousin': { minCM: 75, maxCM: 180, avgCM: 95 },
    },
  },
  {
    id: 'british_irish_colonial',
    label: 'British & Irish Colonial American',
    era: 'British colonization of North America (1607–1776)',
    narrative:
      'Colonial American populations from a few thousand founder families intermarried extensively before westward expansion. People whose ancestry traces to colonial New England, Virginia, or the Carolinas often share notable cM with otherwise unrelated colonial-descended matches.',
    associatedRegions: ['British & Irish'],
    exampleMatchPattern:
      'Two Mayflower-descended people sharing 90 cM may be 6th-7th cousins through dozens of paths, not 4th–5th cousins.',
    sharedPopulationFloor: 35,
    endogamyEquivalent: 1.20,
    cmAdjustments: {
      '4th cousin': { minCM: 35, maxCM: 200, avgCM: 70 },
      '5th cousin': { minCM: 30, maxCM: 160, avgCM: 50 },
    },
  },
  {
    id: 'mennonite_amish',
    label: 'Mennonite / Amish',
    era: 'Anabaptist diaspora (1525–present)',
    narrative:
      'Mennonite and Amish communities have practiced strict in-group marriage for ~500 years, descending from small founder populations. Modern members often share 200+ cM with otherwise unrelated community members through deeply intertwined family lines.',
    associatedRegions: ['Germanic Europe'],
    exampleMatchPattern:
      'Two Pennsylvania Dutch Mennonites sharing 350 cM may be related through 4–8 different ancestral paths.',
    sharedPopulationFloor: 150,
    endogamyEquivalent: 1.75,
    cmAdjustments: {
      '3rd cousin': { minCM: 200, maxCM: 600, avgCM: 350 },
      '4th cousin': { minCM: 160, maxCM: 450, avgCM: 240 },
      '5th cousin': { minCM: 140, maxCM: 350, avgCM: 200 },
    },
  },
  {
    id: 'icelandic',
    label: 'Icelandic',
    era: 'Norse settlement (~874 CE) and continued isolation',
    narrative:
      'Iceland was settled by ~9th-century Norse colonists and has remained relatively genetically isolated for over 1,000 years. Modern Icelanders share substantial DNA with most other Icelanders due to this small founder population.',
    associatedRegions: ['Scandinavian'],
    exampleMatchPattern:
      'Two unrelated Icelanders sharing 60 cM are likely related through 12+ generations across many lines, not as recent cousins.',
    sharedPopulationFloor: 50,
    endogamyEquivalent: 1.40,
    cmAdjustments: {
      '4th cousin': { minCM: 60, maxCM: 240, avgCM: 110 },
      '5th cousin': { minCM: 50, maxCM: 200, avgCM: 80 },
    },
  },
  {
    id: 'polynesian',
    label: 'Polynesian / Māori',
    era: 'Polynesian expansion (~1000–1300 CE)',
    narrative:
      'Polynesian populations descend from small groups of voyagers who settled the Pacific islands over a few centuries. Māori, for example, descend from perhaps 100–200 founding individuals who reached New Zealand ~1300 CE. This extreme bottleneck means two unrelated Māori or Pacific Islanders often share 100–200+ cM from population-level ancestry alone.',
    associatedRegions: ['Polynesian', 'Melanesian', 'Oceanian'],
    exampleMatchPattern:
      'Two Māori individuals sharing 250 cM may appear as 3rd cousins, but after subtracting ~120 cM of population baseline, the true relationship is likely 5th–6th cousins or more distant.',
    sharedPopulationFloor: 120,
    endogamyEquivalent: 1.65,
    cmAdjustments: {
      '3rd cousin': { minCM: 150, maxCM: 500, avgCM: 280 },
      '4th cousin': { minCM: 120, maxCM: 380, avgCM: 200 },
      '5th cousin': { minCM: 110, maxCM: 300, avgCM: 160 },
      '6th cousin': { minCM: 100, maxCM: 240, avgCM: 130 },
    },
  },
  {
    id: 'sephardic',
    label: 'Sephardic / Mizrahi Jewish',
    era: 'Iberian Sephardic diaspora (1492+) and Middle Eastern communities',
    narrative:
      'Sephardic Jews were expelled from Spain and Portugal in the 1490s, forming tight-knit diaspora communities across the Ottoman Empire, North Africa, and the Americas. Mizrahi Jewish communities in the Middle East maintained similar endogamous marriage patterns. Both groups share significant population-level DNA from centuries of in-group marriage.',
    associatedRegions: ['Sephardic Jewish', 'Mizrahi Jewish', 'North African'],
    exampleMatchPattern:
      'Two Sephardic-descended individuals sharing 120 cM may share no documentable ancestor — roughly half (~60 cM) comes from population-wide shared ancestry.',
    sharedPopulationFloor: 60,
    endogamyEquivalent: 1.35,
    cmAdjustments: {
      '3rd cousin': { minCM: 80, maxCM: 350, avgCM: 170 },
      '4th cousin': { minCM: 60, maxCM: 260, avgCM: 110 },
      '5th cousin': { minCM: 55, maxCM: 200, avgCM: 85 },
    },
  },
  {
    id: 'finnish',
    label: 'Finnish',
    era: 'Finnish founder population (~2000 BCE – present)',
    narrative:
      'Finland was settled by a small founder population that remained relatively isolated due to geography and language. A secondary bottleneck occurred during the internal migration of the 16th–17th centuries when small groups settled the interior. This "Finnish Disease Heritage" of ~40 rare genetic conditions reflects the extreme founder effect. Two unrelated Finns often share 50–100+ cM from this shared past.',
    associatedRegions: ['Finnish', 'Northern European'],
    exampleMatchPattern:
      'Two Finns from eastern Finland sharing 130 cM may be 6th–7th cousins through many paths, not 4th cousins as raw cM would suggest.',
    sharedPopulationFloor: 70,
    endogamyEquivalent: 1.40,
    cmAdjustments: {
      '3rd cousin': { minCM: 90, maxCM: 350, avgCM: 170 },
      '4th cousin': { minCM: 70, maxCM: 260, avgCM: 120 },
      '5th cousin': { minCM: 65, maxCM: 200, avgCM: 90 },
    },
  },
  {
    id: 'native_american',
    label: 'Native American / First Nations',
    era: 'Pre-Columbian isolation + post-contact bottleneck',
    narrative:
      'Indigenous American populations experienced severe bottlenecks: first during initial migration from Asia (~15,000+ years ago), then catastrophic population decline after European contact (90%+ in many regions). Surviving communities often descend from very small effective populations. Two unrelated members of the same tribal nation can share 60–150+ cM purely from these bottleneck effects.',
    associatedRegions: ['Native American', 'Indigenous Americas'],
    exampleMatchPattern:
      'Two members of the same First Nations community sharing 150 cM may be distant cousins through dozens of ancestral paths, not the 4th cousins that raw cM suggests.',
    sharedPopulationFloor: 80,
    endogamyEquivalent: 1.45,
    cmAdjustments: {
      '3rd cousin': { minCM: 100, maxCM: 400, avgCM: 200 },
      '4th cousin': { minCM: 80, maxCM: 300, avgCM: 140 },
      '5th cousin': { minCM: 70, maxCM: 240, avgCM: 110 },
    },
  },
  {
    id: 'south_asian',
    label: 'South Asian (endogamous communities)',
    era: 'Caste / jati endogamy (~1,500+ years)',
    narrative:
      'Many South Asian communities have practiced strict endogamy within caste (jati) groups for over 1,500 years, creating genetic isolation between groups living in the same region. Within a jati, members share substantial DNA from this long history of in-group marriage, making distant relatives appear much closer than they are.',
    associatedRegions: ['South Asian', 'South Indian'],
    exampleMatchPattern:
      'Two people from the same South Indian jati sharing 100 cM may have no known common ancestor — most of that sharing (~50 cM) reflects centuries of community-level endogamy.',
    sharedPopulationFloor: 50,
    endogamyEquivalent: 1.30,
    cmAdjustments: {
      '3rd cousin': { minCM: 70, maxCM: 320, avgCM: 150 },
      '4th cousin': { minCM: 50, maxCM: 240, avgCM: 100 },
      '5th cousin': { minCM: 45, maxCM: 190, avgCM: 75 },
    },
  },
];

// ============================================================================
// Lookups
// ============================================================================

export function getPopulationById(id: string): PopulationContext {
  return POPULATION_CONTEXTS.find((p) => p.id === id) || POPULATION_CONTEXTS[0];
}

/**
 * Suggest a default population from the user's primary ancestry region.
 * Returns 'none' if no good match or if percentage is below threshold.
 *
 * @param primaryRegion — the ancestry region string
 * @param percentage — ancestry percentage (0–100). If below 25, returns 'none'.
 */
export function suggestPopulationForAncestry(primaryRegion: string, percentage?: number): string {
  if (percentage !== undefined && percentage < 25) return 'none';

  const lower = primaryRegion.toLowerCase();
  if (lower.includes('ashkenazi')) return 'ashkenazi';
  if (lower.includes('sephardic') || lower.includes('mizrahi')) return 'sephardic';
  if (lower.includes('iberian') || lower.includes('latin')) return 'iberian_latam';
  if (lower.includes('eastern european') || lower.includes('baltic')) return 'baltic_slavic';
  if (lower.includes('scandinavian')) return 'icelandic';
  if (lower.includes('british') || lower.includes('irish')) return 'british_irish_colonial';
  if (lower.includes('polynesian') || lower.includes('maori') || lower.includes('oceanian') || lower.includes('melanesian')) return 'polynesian';
  if (lower.includes('finnish')) return 'finnish';
  if (lower.includes('native american') || lower.includes('indigenous')) return 'native_american';
  if (lower.includes('south asian') || lower.includes('south indian')) return 'south_asian';
  if (lower.includes('north african')) return 'sephardic';
  return 'none';
}

/**
 * Return population contexts relevant to a match's ancestry composition.
 * Always includes 'none'. Only considers ancestry components with ≥25%
 * to avoid suggesting populations based on minor ancestry fractions.
 */
export function getRelevantPopulations(
  ancestryComponents: AncestryComponent[],
): PopulationContext[] {
  // Filter to significant ancestry components (≥25%)
  const significant = ancestryComponents.filter((a) => a.percentage >= 25);
  if (significant.length === 0) return POPULATION_CONTEXTS;

  const lowerRegions = significant.map((a) => a.region.toLowerCase());

  const relevant = POPULATION_CONTEXTS.filter((pop) => {
    if (pop.id === 'none') return true;
    return pop.associatedRegions.some((assoc) => {
      const la = assoc.toLowerCase();
      return lowerRegions.some(
        (lr) => lr.includes(la) || la.includes(lr),
      );
    });
  });

  // If only 'none' matched, also check with suggestPopulationForAncestry
  // as a fallback (it uses broader matching)
  if (relevant.length <= 1 && significant.length > 0) {
    for (const comp of significant) {
      const suggested = suggestPopulationForAncestry(comp.region, comp.percentage);
      if (suggested !== 'none') {
        const pop = POPULATION_CONTEXTS.find((p) => p.id === suggested);
        if (pop && !relevant.includes(pop)) relevant.push(pop);
      }
    }
  }

  return relevant;
}

/**
 * For a given observed cM and population context, compute:
 *   - The cM attributable to recent ancestry (subtracting the population floor)
 *   - The set of relationship matches based on this residual
 *
 * Used by the cM Clarity panel to show "after population context"
 * predictions alongside the raw histogram.
 */
export function recentAncestorCM(observedCM: number, population: PopulationContext): number {
  return Math.max(0, observedCM - population.sharedPopulationFloor);
}
