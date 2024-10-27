// real-case-analysis.interface.ts

// 필요한 다른 인터페이스들 불러오기
import { ISajuPillar } from '../base/saju-pillar.interface';
import { ElementType } from '../base/five-elements.interface';

// 실제 사례의 기본 정보를 나타내는 인터페이스
export interface IRealCase {
  // 사례의 고유 ID
  id: string;

  // 사례와 관련된 사주 정보
  sajuPillar: ISajuPillar;

  // 이 사례가 언제 기록되었나요?
  recordedAt: Date;

  // 이 사례가 검증된 날짜 (확인된 날짜)
  verifiedAt: Date;

  // 이 사례가 어떻게 확인되었는지
  verificationMethod: string;

  // 사례의 신뢰도 (100점 만점)
  reliability: number;
}

// 실제 사례의 결과를 나타내는 인터페이스
export interface ICaseResult {
  // 예측했던 내용
  prediction: {
    content: string; // 예측 내용
    confidence: number; // 예측 당시 신뢰도
    predictedAt: Date; // 예측한 날짜
  };

  // 실제로 일어난 일
  actualOutcome: {
    content: string; // 실제 결과
    occurredAt: Date; // 실제로 일어난 날짜
    evidence: string; // 증거나 근거
  };

  // 예측이 얼마나 정확했나요? (0-100%)
  accuracy: number;

  // 예측과 실제 결과의 차이점
  differences?: string[];

  // 이 사례에서 배운 점
  learnings: string[];
}

// 비슷한 사례들을 찾고 분석하는 인터페이스
export interface IRealCaseAnalysis {
  // 찾은 비슷한 사례들
  matchedCases: {
    case: IRealCase; // 비슷한 사례
    similarityScore: number; // 얼마나 비슷한지 점수 (0-100)
    keyMatches: string[]; // 어떤 점이 비슷한지
    results: ICaseResult; // 그 사례의 결과
  }[];

  // 사례들의 통계 분석
  statistics: {
    totalCases: number; // 전체 찾은 사례 수
    averageAccuracy: number; // 평균 정확도
    successRate: number; // 성공률
    confidenceLevel: number; // 신뢰도 수준
  };

  // 사례 기반 예측
  predictions: {
    mainPrediction: string; // 주요 예측 내용
    confidence: number; // 예측 신뢰도
    supportingCases: number; // 이 예측을 지지하는 사례 수
    conditions: string[]; // 예측이 맞을 조건들
    variables: string[]; // 영향을 줄 수 있는 변수들
  };

  // 실제 사례들에서 찾은 조언
  recommendationsFromCases: {
    doList: string[]; // 하면 좋을 일들
    dontList: string[]; // 피하면 좋을 일들
    timing: {
      good: string[]; // 좋은 시기
      bad: string[]; // 피해야 할 시기
    };
  };
}

// 사례 기반 학습 결과를 나타내는 인터페이스
export interface ICaseLearningResults {
  // 패턴 학습 결과
  patterns: {
    pattern: string; // 발견된 패턴
    frequency: number; // 얼마나 자주 나타났나?
    reliability: number; // 패턴의 신뢰도
    conditions: string[]; // 패턴이 나타나는 조건
  }[];

  // 특이한 사례들
  unusualCases: {
    case: IRealCase; // 특이한 사례
    reason: string; // 왜 특이한가?
    learnings: string[]; // 이 사례에서 배울 점
  }[];

  // 성공적인 대처 방법들
  successfulStrategies: {
    strategy: string; // 대처 방법
    successRate: number; // 성공률
    context: string; // 어떤 상황에서 효과적인지
  }[];
}

// 실제 사례와 현재 분석을 비교하는 인터페이스
export interface ICaseComparison {
  // 현재 사주와 가장 비슷한 사례들
  bestMatches: {
    case: IRealCase;
    similarityScore: number;
    keyDifferences: string[];
    implications: string[];
  }[];

  // 비교를 통해 얻은 통찰
  insights: {
    mainPoints: string[]; // 주요 시사점
    risks: string[]; // 주의할 점
    opportunities: string[]; // 기회 요소
  };

  // 실제 사례에서 배운 구체적 조언
  practicalAdvice: {
    shortTerm: string[]; // 단기 조언
    longTerm: string[]; // 장기 조언
    situational: string[]; // 상황별 조언
  };
}
