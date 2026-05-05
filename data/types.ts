export interface SharedCmEntry {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  probability: number;
}

export interface SharedCmEntryV4 {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  probability: number;
  histogram: number[];
  category: 'close' | 'moderate' | 'distant' | 'very-distant';
  generationGap: number;
}

// Subset of the DNAMatch shape used by the matches list — just the fields
// we need to render and click-through. The full shape lives in match-hub.
export interface AncestryComponent {
  region: string;
  percentage: number;
}

export interface DNAMatch {
  id: string;
  name: string;
  sharedCM: number;
  sharedPercentage: number;
  relationship: string;
  kinship?: string;
  source: '23andme' | 'myheritage' | 'ftdna' | 'gedmatch' | 'ancestry' | 'manual' | 'other';
  profileType: 'open' | 'limited';
  isNew: boolean;
  segments: unknown[];        // not rendered here; cM Predictor doesn't need the segment shape
  tags: string[];
  avatarColor: string;
  initials: string;
  lineage?: 'paternal' | 'maternal' | 'unassigned';
  sharedSurnames?: string[];
  ancestryComposition?: AncestryComponent[];
}
