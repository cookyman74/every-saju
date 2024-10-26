export interface SeasonalInfluence {
  season: string;
  elementStrength: {
    [key: string]: number; // 각 오행의 강도
  };
  characteristics: string[];
  timeOfDay: {
    period: string;
    influence: number;
  }[];
}
