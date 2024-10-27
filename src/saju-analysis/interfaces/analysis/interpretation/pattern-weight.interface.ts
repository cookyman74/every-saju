// interpretation/pattern-weight.interface.ts

// 패턴 가중치의 기본 단계를 정의하는 열거형
export enum PatternWeight {
  NEGLIGIBLE = 0, // 참고 정도의 가중치
  VERY_LOW = 1, // 매우 낮은 가중치
  LOW = 2, // 낮은 가중치
  MEDIUM = 3, // 보통 가중치
  HIGH = 4, // 높은 가중치
  VERY_HIGH = 5, // 매우 높은 가중치
  CRITICAL = 6, // 결정적인 가중치
}

// 패턴 가중치의 세부 정보를 나타내는 인터페이스
export interface IPatternWeightDetails {
  weight: PatternWeight; // 기본 가중치 값
  reason: string; // 적용 이유 설명
  adjustmentFactors: {
    // 가중치 조정 요소들
    factor: string; // 조정 요인 (예: "계절적 영향")
    adjustment: number; // 조정값 (-1.0 ~ 1.0)
    reason: string; // 조정 이유
  }[];
  finalWeight: number; // 최종 가중치 (조정값 포함)
}

// 가중치 계산 규칙을 나타내는 인터페이스
export interface IWeightCalculationRule {
  name: string; // 규칙 이름
  description: string; // 규칙 설명
  conditions: {
    // 적용 조건들
    description: string; // 조건 설명
    check: () => boolean; // 조건 확인 함수
  }[];
  adjustment: number; // 가중치 조정값
  priority: number; // 규칙 우선순위 (1이 가장 높음)
}

// 시간에 따른 가중치 변화를 나타내는 인터페이스
export interface IWeightTimeline {
  startDate: Date; // 시작 시점
  endDate?: Date; // 종료 시점 (없으면 계속 유효)
  weight: PatternWeight; // 기간 내 가중치
  reason: string; // 변화 이유
}

// 복합 가중치를 나타내는 인터페이스
export interface ICompositeWeight {
  baseWeight: PatternWeight; // 기본 가중치
  timeline: IWeightTimeline[]; // 시간에 따른 가중치 변화
  adjustmentRules: IWeightCalculationRule[]; // 조정 규칙
  calculateCurrentWeight(): number; // 현재 최종 가중치 계산 함수
}

// 가중치 통계를 나타내는 인터페이스
export interface IWeightStatistics {
  averageWeight: number; // 평균 가중치
  minWeight: number; // 최소 가중치
  maxWeight: number; // 최대 가중치
  distribution: {
    // 가중치 분포
    [key in PatternWeight]: number;
  };
  trends: {
    // 시간대별 가중치 추이
    period: string;
    averageWeight: number;
    changeSummary: string;
  }[];
}

// 가중치 검증 결과를 나타내는 인터페이스
export interface IWeightValidation {
  isValid: boolean; // 검증 통과 여부
  issues: {
    // 발견된 문제점
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    recommendation: string;
  }[];
  confidenceScore: number; // 전체 신뢰도 (0-100)
  recommendations: string[]; // 개선 제안사항
}
