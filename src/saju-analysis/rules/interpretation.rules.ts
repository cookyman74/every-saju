// src/saju-analysis/rules/interpretation.rules.ts

import { InterpretationPattern } from '@prisma/client';
import {
  IInterpretationConflict,
  IInterpretation,
  IPatternComposition,
  IPatternMatchResult,
  ICompositionOptions,
  CompositionPriority,
} from '../interfaces/analysis/interpretation/interpretation.interface';

// Prisma 모델과 인터페이스 매핑을 위한 타입 정의
interface InterpretationPatternWithContent extends InterpretationPattern {
  content: string;
  type: string;
}

// 해석 규칙에 사용되는 상수들
export const InterpretationConstants = {
  MIN_CONFIDENCE: 0.3,
  MAX_CONFIDENCE: 1.0,
  WEIGHT_THRESHOLD: 0.5,
};

// 해석 규칙을 정의하는 객체
export const InterpretationRules = {
  /**
   * 여러 해석 패턴을 조합하는 규칙
   * @param patterns 조합할 해석 패턴들
   */
  combinePatterns: (patterns: InterpretationPatternWithContent[]): string => {
    const sortedPatterns = sortPatternsByWeight(patterns);
    return combinePatternContents(sortedPatterns);
  },

  /**
   * 패턴 매칭 점수와 패턴을 조합하여 최적의 해석을 생성
   * @param result 패턴 매칭 결과
   * @param options 해석 옵션
   */
  composePattern: async (
    result: IPatternMatchResult,
    options: ICompositionOptions,
  ): Promise<IPatternComposition> => {
    const pattern =
      result.pattern as unknown as InterpretationPatternWithContent;

    const interpretation: IInterpretation = {
      id: pattern.id,
      category: pattern.type,
      content: pattern.content || '',
      confidence: result.confidence,
      usedPatterns: [pattern.id],
      relatedElements: [],
      recommendations: [],
      priority: CompositionPriority.PRIMARY,
      cautions: [],
    };

    const hasConflict = false;

    return {
      content: interpretation.content,
      hasConflict,
      interpretation,
    };
  },

  /**
   * 해석의 신뢰도를 계산하는 규칙
   * @param patterns 사용된 패턴들
   * @param matchScores 패턴별 매칭 점수
   */
  calculateConfidence: (
    patterns: InterpretationPatternWithContent[],
    matchScores: number[],
  ): number => {
    const weightedScores = calculateWeightedScores(patterns, matchScores);
    return Math.max(
      InterpretationConstants.MIN_CONFIDENCE,
      Math.min(InterpretationConstants.MAX_CONFIDENCE, weightedScores),
    );
  },

  /**
   * 상충되는 해석을 처리하는 규칙
   * @param conflicts 처리할 충돌들
   */
  resolveConflicts: (
    conflicts: IInterpretationConflict[],
  ): IInterpretationConflict[] => {
    return conflicts.map((conflict) => ({
      ...conflict,
      resolution: `Conflict resolved: ${conflict.description}`,
    }));
  },

  /**
   * 패턴 상충 여부 확인
   * @param pattern 검사할 패턴
   * @param compositions 기존 조합된 패턴들
   */
  hasConflicts: (
    pattern: InterpretationPatternWithContent,
    compositions: InterpretationPatternWithContent[],
  ): boolean => {
    return compositions.some(
      (existingPattern) => existingPattern.content === pattern.content,
    );
  },
};

// 헬퍼 함수들
/**
 * 패턴을 가중치 순으로 정렬
 */
function sortPatternsByWeight(
  patterns: InterpretationPatternWithContent[],
): InterpretationPatternWithContent[] {
  return [...patterns].sort((a, b) => b.weight - a.weight);
}

/**
 * 패턴 내용을 조합
 */
function combinePatternContents(
  patterns: InterpretationPatternWithContent[],
): string {
  return patterns
    .map((pattern) => pattern.content || '')
    .filter((content) => content.length > 0)
    .join('\n');
}

/**
 * 가중치가 적용된 점수를 계산
 */
function calculateWeightedScores(
  patterns: InterpretationPatternWithContent[],
  scores: number[],
): number {
  const totalWeight = patterns.reduce(
    (acc, pattern) => acc + pattern.weight,
    0,
  );

  if (totalWeight === 0) {
    return 0;
  }

  return patterns.reduce((acc, pattern, index) => {
    const weight = pattern.weight;
    const score = scores[index] || 0;
    return acc + (weight / totalWeight) * score;
  }, 0);
}

/**
 * 충돌하는 해석 정보를 위한 인터페이스
 */
interface ConflictingInterpretation {
  content: string;
  normalizedContent: string;
  index: number;
}

/**
 * 상충되는 해석을 찾는 함수
 */
function findConflictingInterpretations(
  interpretations: string[],
): ConflictingInterpretation[] {
  const conflicts: ConflictingInterpretation[] = [];
  const seen = new Map<string, number>();

  interpretations.forEach((content, index) => {
    const normalized = content.toLowerCase().trim();
    if (seen.has(normalized)) {
      conflicts.push({
        content,
        normalizedContent: normalized,
        index,
      });
    } else {
      seen.set(normalized, index);
    }
  });

  return conflicts;
}

/**
 * 상충을 해결하는 함수
 */
function resolveInterpretationConflicts(
  interpretations: string[],
  conflicts: ConflictingInterpretation[],
): string[] {
  const conflictSet = new Set(conflicts.map((c) => c.normalizedContent));

  return interpretations.map((interpretation) => {
    const normalized = interpretation.toLowerCase().trim();
    if (conflictSet.has(normalized)) {
      return `⚠️ ${interpretation} (resolved)`;
    }
    return interpretation;
  });
}
