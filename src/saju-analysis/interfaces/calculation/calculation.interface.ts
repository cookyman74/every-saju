// calculation/calculation.interface.ts

import { ElementType } from '../base/five-elements.interface';
import { ISajuPillar } from '../base/saju-pillar.interface';

// 계산 방식을 정의하는 인터페이스
export interface ICalculationMethod {
  // 계산 방식의 고유 ID
  id: string;

  // 계산 방식 이름
  name: string;

  // 계산 방식 설명
  description: string;

  // 계산에 필요한 입력값들
  requiredInputs: string[];

  // 계산 우선순위 (낮은 숫자가 높은 우선순위)
  priority: number;

  // 계산 정확도 (0-100%)
  accuracy: number;

  // 이 계산 방식이 적용 가능한 조건
  applicableConditions: {
    condition: string;
    description: string;
  }[];
}

// 오행 계산을 위한 인터페이스
export interface IElementCalculation {
  // 기본 오행 강도 계산
  calculateBaseStrength(element: ElementType): number;

  // 계절에 따른 오행 보정
  calculateSeasonalAdjustment(element: ElementType, season: string): number;

  // 시간에 따른 오행 보정
  calculateTimeAdjustment(element: ElementType, hour: number): number;

  // 오행 간의 상호작용 계산
  calculateInteraction(
    element1: ElementType,
    element2: ElementType,
  ): {
    type: '상생' | '상극' | '중성';
    strength: number;
  };
}

// 시간 보정 계산을 위한 인터페이스
export interface ITimeCalculation {
  // 시간대 보정
  calculateTimeZoneAdjustment(localTime: Date, timezone: string): Date;

  // 절기 기반 시간 보정
  calculateSolarTermAdjustment(date: Date, solarTerm: string): number;

  // 계절 기반 시간 보정
  calculateSeasonalTimeAdjustment(date: Date, season: string): number;
}

// 분석 점수 계산을 위한 인터페이스
export interface IScoreCalculation {
  // 기본 점수 계산
  calculateBaseScore(data: any): number;

  // 가중치 적용
  applyWeights(baseScore: number, weights: Record<string, number>): number;

  // 보정값 계산
  calculateAdjustments(context: any): Record<string, number>;

  // 최종 점수 계산
  calculateFinalScore(
    baseScore: number,
    adjustments: Record<string, number>,
  ): number;
}

// 계산 결과를 나타내는 인터페이스
export interface ICalculationResult {
  // 계산된 값
  value: number;

  // 신뢰도 (0-100%)
  confidence: number;

  // 사용된 계산 방식
  method: ICalculationMethod;

  // 적용된 보정값들
  adjustments: Record<string, number>;

  // 계산 시간
  calculatedAt: Date;

  // 다음 재계산 추천 시기
  nextRecalculationAt?: Date;
}

// 계산 이력을 나타내는 인터페이스
export interface ICalculationHistory {
  // 계산 ID
  id: string;

  // 계산 종류
  type: string;

  // 입력값
  input: any;

  // 결과값
  result: ICalculationResult;

  // 계산 시간
  timestamp: Date;

  // 성능 메트릭
  performance: {
    duration: number; // 계산 소요 시간 (ms)
    memoryUsage: number; // 메모리 사용량 (bytes)
  };
}
