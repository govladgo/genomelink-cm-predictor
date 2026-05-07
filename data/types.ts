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

export interface Segment {
  chromosome: number;
  startBp: number;
  endBp: number;
  cM: number;
  snps: number;
  isTriangulated: boolean;
}

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
  segments: Segment[];
  tags: string[];
  avatarColor: string;
  initials: string;
  lineage?: 'paternal' | 'maternal' | 'unassigned';
  sharedSurnames?: string[];
  ancestryComposition?: AncestryComponent[];
}
