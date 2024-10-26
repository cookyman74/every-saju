export interface AnalysisResult {
  sajuPillar: SajuPillar;
  elementAnalysis: {
    dominant: string[];
    weak: string[];
    balanced: string[];
    recommendations: string[];
  };
  interpretation: {
    category: string;
    content: string;
    confidence: number;
  }[];
  destinyInfluence: MajorDestinyInfluence[];
  seasonalFactors: SeasonalInfluence;
  realCaseAnalysis?: RealCaseAnalysis;
}
