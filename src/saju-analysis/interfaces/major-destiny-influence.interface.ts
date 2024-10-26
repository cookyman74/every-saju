export interface MajorDestinyPeriod {
  startAge: number;
  endAge: number;
  stem: Stem;
  branch: Branch;
}

export interface MajorDestinyInfluence {
  period: MajorDestinyPeriod;
  influence: {
    type: 'favorable' | 'neutral' | 'unfavorable';
    strength: number;
    description: string;
  };
  relationWithBasicNature: {
    type: string;
    impact: string;
  };
}
