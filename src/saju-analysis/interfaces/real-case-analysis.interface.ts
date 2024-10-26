export interface RealCase {
  id: string;
  pattern: {
    conditions: any;
    result: string;
  };
  actualResult: string;
  similarity: number;
  verifiedAt: Date;
}

export interface RealCaseAnalysis {
  matchedCases: RealCase[];
  similarityScore: number;
  confidence: number;
  recommendations: string[];
}
