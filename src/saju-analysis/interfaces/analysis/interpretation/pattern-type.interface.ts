// interpretation/pattern-type.interface.ts

// 패턴 중요도를 위한 enum 추가
export enum PatternImportance {
  LOWEST = 1,
  VERY_LOW = 2,
  LOW = 3,
  BELOW_AVERAGE = 4,
  AVERAGE = 5,
  ABOVE_AVERAGE = 6,
  HIGH = 7,
  VERY_HIGH = 8,
  CRITICAL = 9,
  HIGHEST = 10,
}

// 기본적인 패턴 타입을 정의하는 열거형
export enum PatternType {
  PERSONALITY = 'PERSONALITY', // 성격 패턴
  MAJOR_DESTINY = 'MAJOR_DESTINY', // 대운 패턴
  YEARLY_DESTINY = 'YEARLY_DESTINY', // 년운 패턴
  MONTHLY_DESTINY = 'MONTHLY_DESTINY', // 월운 패턴
  DAILY_DESTINY = 'DAILY_DESTINY', // 일운 패턴
  CAREER = 'CAREER', // 직업/사업운
  WEALTH = 'WEALTH', // 재물운
  RELATIONSHIP = 'RELATIONSHIP', // 인간관계운
  HEALTH = 'HEALTH', // 건강운
  STUDY = 'STUDY', // 학업운
  GENERAL = 'GENERAL', // 일반적인 패턴
  SPECIAL = 'SPECIAL', // 특별한 패턴
}

// 패턴의 세부 특성을 정의하는 인터페이스
export interface IPatternTypeDetails {
  type: PatternType;
  description: string;
  importance: PatternImportance; // 패턴의 중요도에 enum 적용

  // 패턴 분석에 필요한 최소 데이터 요구사항
  requirements: {
    required: string[];
    optional: string[];
  };

  analysisMethod: {
    steps: string[];
    cautions: string[];
  };
}

// 패턴 매칭 결과를 나타내는 인터페이스
export interface IPatternMatch {
  patternType: PatternType;
  matchScore: number;
  matchReasons: string[];
  confidence: number;
}

// 패턴 분석 설정을 나타내는 인터페이스
export interface IPatternAnalysisConfig {
  enabledPatternTypes: PatternType[];
  minimumMatchScore: number;
  minimumConfidence: number;
  detailedAnalysis: boolean;
  priorities: {
    patternType: PatternType;
    priority: number;
  }[];
}

// 패턴 그룹을 나타내는 인터페이스
export interface IPatternGroup {
  name: string;
  patternTypes: PatternType[];
  description: string;
  priority: number;
  groupConfig?: IPatternAnalysisConfig;
}

// 패턴 유형별 분석 결과를 위한 새로운 인터페이스
export interface ITypedPatternResult {
  patternType: PatternType;
  matches: IPatternMatch[];
  confidence: number;
  significance: number; // 이 유형의 전체 결과에 대한 중요도
}

// 패턴 분석 결과를 나타내는 인터페이스
export interface IPatternAnalysisResult {
  matches: IPatternMatch[];
  typeResults: ITypedPatternResult[]; // 패턴 유형별 결과 추가
  overallConfidence: number;
  usedConfig: IPatternAnalysisConfig;
  groupResults: {
    group: IPatternGroup;
    matches: IPatternMatch[];
    groupConfidence: number;
  }[];
  analyzedAt: Date;
  nextAnalysisRecommendedAt?: Date;

  // 가장 중요한 패턴 매칭 결과
  significantMatches: {
    pattern: IPatternMatch;
    reason: string;
  }[];
}
