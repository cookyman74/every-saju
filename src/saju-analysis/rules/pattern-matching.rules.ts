// pattern-matching.rules.ts

import { ElementType } from '../interfaces/base/five-elements.interface';
import { ISajuPillar } from '../interfaces/base/saju-pillar.interface';

// 패턴 매칭 점수를 계산하기 위한 가중치 정의
export const PatternMatchingWeights = {
  EXACT_MATCH: 100, // 정확히 일치할 때
  PARTIAL_MATCH: 70, // 부분적으로 일치할 때
  RELATED_MATCH: 50, // 관련은 있으나 직접적 일치는 아닐 때
  MINIMAL_MATCH: 30, // 최소한의 관련성만 있을 때
};

// 패턴 매칭 규칙을 정의하는 객체
export const PatternMatchingRules = {
  /**
   * 천간과 지지의 조합이 일치하는지 확인하는 규칙
   * @param pattern 비교할 패턴
   * @param target 대상이 되는 사주 데이터
   */
  matchStemBranch: (pattern: any, target: any): number => {
    let score = 0;

    // 천간 매칭 검사
    if (pattern.stem === target.stem) {
      score += PatternMatchingWeights.EXACT_MATCH;
    } else if (areRelatedStems(pattern.stem, target.stem)) {
      score += PatternMatchingWeights.RELATED_MATCH;
    }

    // 지지 매칭 검사
    if (pattern.branch === target.branch) {
      score += PatternMatchingWeights.EXACT_MATCH;
    } else if (areRelatedBranches(pattern.branch, target.branch)) {
      score += PatternMatchingWeights.RELATED_MATCH;
    }

    return score / 2; // 평균 점수 반환
  },

  /**
   * 오행의 관계를 분석하는 규칙
   * @param pattern 비교할 패턴의 오행
   * @param target 대상이 되는 오행
   */
  matchElements: (pattern: ElementType[], target: ElementType[]): number => {
    let score = 0;
    const elementRelations = calculateElementRelations(pattern, target);

    // 상생 관계 점수 계산
    score += elementRelations.generating * PatternMatchingWeights.RELATED_MATCH;

    // 상극 관계 점수 계산 (부정적 영향)
    score -=
      elementRelations.controlling * PatternMatchingWeights.MINIMAL_MATCH;

    return Math.max(0, score); // 음수 점수 방지
  },

  /**
   * 전체적인 패턴 매칭 점수를 계산하는 규칙
   * @param pattern 매칭할 패턴
   * @param sajuPillar 사주 데이터
   */
  calculateOverallMatch: (pattern: any, sajuPillar: ISajuPillar): number => {
    const stemBranchScore = PatternMatchingRules.matchStemBranch(
      pattern,
      sajuPillar,
    );
    const elementScore = PatternMatchingRules.matchElements(
      pattern.elements,
      extractElements(sajuPillar),
    );

    // 가중치를 적용한 최종 점수 계산
    return stemBranchScore * 0.6 + elementScore * 0.4;
  },
};

// 천간 관계를 확인하는 헬퍼 함수
function areRelatedStems(stem1: string, stem2: string): boolean {
  // 천간 관계 로직 구현
  // 실제 구현에서는 상세한 천간 관계 규칙 적용
  return false;
}

// 지지 관계를 확인하는 헬퍼 함수
function areRelatedBranches(branch1: string, branch2: string): boolean {
  // 지지 관계 로직 구현
  // 실제 구현에서는 상세한 지지 관계 규칙 적용
  return false;
}

// 오행 관계를 계산하는 헬퍼 함수
function calculateElementRelations(
  elements1: ElementType[],
  elements2: ElementType[],
) {
  // 오행 상생상극 관계 계산
  return {
    generating: 0, // 상생 관계 수
    controlling: 0, // 상극 관계 수
  };
}

// 사주에서 오행을 추출하는 헬퍼 함수
function extractElements(sajuPillar: ISajuPillar): ElementType[] {
  // 사주의 모든 기둥에서 오행 정보 추출
  return [];
}
