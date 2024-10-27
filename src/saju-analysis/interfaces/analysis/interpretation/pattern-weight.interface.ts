// interpretation/pattern-weight.interface.ts

// 패턴의 우선순위와 가중치를 위한 열거형
export enum PatternWeight {
  LOW = 1,
  MEDIUM = 5,
  HIGH = 10,
  VERY_HIGH = 15,
  CRITICAL = 20,
}

// 패턴 가중치 계산을 위한 메서드 정의
export interface IPatternWeightCalculation {
  // 기본 가중치
  baseWeight: PatternWeight;

  // 추가 요소 (예: 신뢰도, 조건 만족도)
  modifiers?: {
    confidence: number; // 신뢰도 기반 조정 (0-1)
    conditionMatchRate: number; // 조건 만족도 기반 조정 (0-1)
  };

  // 최종 가중치 계산 메서드
  calculateFinalWeight(): number;
}

// 패턴의 가중치를 계산하고 적용하는 인터페이스
export interface IPatternWeightedResult {
  // 패턴의 ID
  patternId: string;

  // 이 패턴의 가중치
  weight: PatternWeight;

  // 최종 가중치 (조정 후 값)
  finalWeight: number;

  // 가중치가 높은 패턴인지 여부
  isSignificant: boolean;

  // 가중치 결과 설명
  weightDescription: string;
}

// 패턴의 가중치를 적용하고 관리하는 인터페이스
export interface IPatternWeightManager {
  // 패턴 가중치 목록
  weights: IPatternWeightedResult[];

  // 특정 패턴의 가중치를 계산하고 추가
  addPatternWeight(
    patternId: string,
    weight: PatternWeight,
    confidence: number,
    conditionMatchRate: number,
  ): IPatternWeightedResult;

  // 가중치가 높은 패턴들을 반환
  getSignificantPatterns(minimumWeight: number): IPatternWeightedResult[];

  // 가중치가 높은 패턴을 정렬하여 반환
  sortPatternsByWeight(descending?: boolean): IPatternWeightedResult[];
}
