// src/saju-analysis/interfaces/interpretation/interpretation.interface.ts

import { ElementType } from '../../base/five-elements.interface';
import { PatternType } from './pattern-type.interface';
import { PatternWeight } from './pattern-weight.interface';
import { ConfidenceLevel } from '../../../services/pattern-matching/pattern-matching.service';

/**
 * 해석 조건을 나타내는 인터페이스
 */
export interface IInterpretationCondition {
  required: boolean; // 필수 조건 여부
  type: string; // 조건 유형 (예: 천간, 지지 등)
  value: any; // 조건 값
  priority: number; // 조건 우선순위 (1이 가장 높음)
  weight: number; // 조건 일치 시 가중치
}

/**
 * 해석 패턴을 나타내는 인터페이스
 */
export interface IInterpretationPattern {
  id: string; // 패턴 고유 ID
  name: string; // 패턴 이름
  type: PatternType; // 패턴 유형
  conditions: IInterpretationCondition[]; // 패턴 적용 조건
  weight: PatternWeight; // 패턴 가중치
  isActive: boolean; // 패턴 활성화 여부
  createdAt: Date; // 생성 날짜
  updatedAt: Date; // 수정 날짜
}

/**
 * 개별 패턴 매칭 결과의 구조 정의
 */
export interface IPatternMatchResult {
  pattern: IInterpretationPattern; // 매칭된 패턴
  matchScore: number; // 매칭 점수
  confidence: number; // 매칭 신뢰도
  confidenceLevel: ConfidenceLevel; // 신뢰도 수준 (HIGH, MEDIUM 등)
}

/**
 * 해석 조합 옵션 설정을 위한 인터페이스 정의
 */
export interface ICompositionOptions {
  maxResults?: number; // 최대 결과 수
  includeConflicts?: boolean; // 충돌 포함 여부
}

/**
 * 해석 조합 우선순위를 지정하기 위한 열거형
 */
export enum CompositionPriority {
  PRIMARY = 'PRIMARY', // 주요 해석
  SUPPORTING = 'SUPPORTING', // 보조 해석
  OPTIONAL = 'OPTIONAL', // 선택적 해석
}

/**
 * 해석 조합 성능 메트릭을 위한 인터페이스 정의
 */
export interface ICompositionMetrics {
  processingTime: number; // 총 처리 시간 (밀리초 단위)
  combinationsCount: number; // 처리된 패턴 조합 수
  conflictResolutions: number; // 해결된 충돌 수
  cacheHit: boolean; // 캐시에서 결과를 가져왔는지 여부
}

/**
 * 해석 조합 과정의 상황 정보를 담는 인터페이스
 */
export interface ICompositionContext {
  method: string; // 실행 중인 메서드 이름
  matchResultsCount: number; // 사용된 패턴 매칭 개수
  options: any; // 조합에 사용된 옵션
  startTime: number; // 프로세스가 시작된 타임스탬프
}

/**
 * 충돌 정보를 담는 인터페이스
 */
export interface IInterpretationConflict {
  type: string; // 충돌 유형 (예: '패턴 충돌', '데이터 불일치')
  description: string; // 충돌 설명
  severity: 'HIGH' | 'MEDIUM' | 'LOW'; // 충돌 심각도 ('HIGH'는 심각도 높음)
  affectedPatterns: string[]; // 영향을 받는 패턴의 ID 목록
  resolution?: string; // 충돌 해결을 위한 권장 조치 (선택 사항)
}

/**
 * 적용 기간을 나타내는 인터페이스
 */
export interface IApplicablePeriod {
  startDate: string; // 시작 날짜 (ISO 형식)
  endDate?: string; // 종료 날짜 (ISO 형식, 선택적)
}

/**
 * 해석 결과를 나타내는 인터페이스
 */
export interface IInterpretation {
  id: string; // 해석 고유 ID
  category: string; // 해석 카테고리
  content: string; // 해석 내용
  confidence: number; // 신뢰도 (0-100)
  usedPatterns: string[]; // 사용된 패턴들
  relatedElements: string[]; // 관련 오행
  applicablePeriod?: IApplicablePeriod; // 적용 기간 (선택적)
  recommendations: string[]; // 해석에 대한 추천사항
  cautions?: string[]; // 주의사항 (선택적)
  priority: CompositionPriority;
}

/**
 * 최종 해석 결과의 구조 정의
 */
export interface IInterpretationResult {
  mainInterpretation: IInterpretation; // 메인 해석
  supportingInterpretations: IInterpretation[]; // 보조 해석들
  conflicts: IInterpretationConflict[]; // 해석 간 충돌 정보
  confidence: number; // 전체 신뢰도 (0-100)
  metadata: {
    // 메타데이터
    compositionCount: number; // 조합 수
    conflictCount: number; // 충돌 수
    timestamp: string; // 생성 시각 (ISO 형식)
    processingTime: number; // 추가
  };
}

/**
 * 해석 카테고리를 나타내는 인터페이스
 */
export interface IInterpretationCategory {
  id: string; // 카테고리 ID
  name: string; // 카테고리 이름
  description: string; // 카테고리 설명
  orderIndex: number; // 표시 순서
  isActive: boolean; // 활성화 여부
}

/**
 * 해석 규칙을 나타내는 인터페이스
 */
export interface IInterpretationRule {
  id: string; // 규칙 ID
  name: string; // 규칙 이름
  description: string; // 규칙 설명
  priority: number; // 규칙 우선순위
  conditions: string[]; // 규칙 조건 목록
  actions: string[]; // 규칙이 적용될 때의 동작
  exceptions?: string[]; // 예외 사항 (선택적)
}

/**
 * 해석 이력을 나타내는 인터페이스
 */
export interface IInterpretationHistory {
  interpretationId: string; // 해석 ID
  analyzedAt: Date; // 해석 일시
  usedPatterns: string[]; // 사용된 패턴들
  confidence: number; // 신뢰도
  wasAccurate?: boolean; // 정확도 여부 (선택적)
  feedback?: string; // 피드백 (선택적)
}

/**
 * 여러 해석을 조합한 최종 결과를 나타내는 인터페이스
 */
export interface ICompositeInterpretation {
  mainInterpretation: IInterpretation; // 메인 해석
  supportingInterpretations: IInterpretation[]; // 보조 해석
  overallConfidence: number; // 전체 신뢰도 (0-100)
  relationships: {
    // 해석 간 관계 정보
    type: '보완' | '충돌' | '중립';
    description: string;
  }[];
  finalRecommendations: string[]; // 최종 추천 사항
}

/**
 * 패턴 조합 결과를 나타내는 인터페이스
 */
export interface IPatternComposition {
  content: string;
  hasConflict: boolean;
  interpretation: IInterpretation;
}
