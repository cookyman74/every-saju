// interpretation/interpretation.interface.ts

// 필요한 인터페이스들 불러오기
import { ElementType } from '../../base/five-elements.interface';
import { PatternType } from './pattern-type.interface';
import { PatternWeight } from './pattern-weight.interface';

// 해석 조건을 나타내는 인터페이스
export interface IInterpretationCondition {
  // 필수 여부 (이 조건이 꼭 필요한지)
  required: boolean;

  // 조건의 종류 (예: '천간', '지지', '오행' 등)
  type: string;

  // 조건의 값
  value: any;

  // 조건의 우선순위 (1이 가장 높음)
  priority: number;

  // 이 조건이 맞았을 때의 가중치 (0-100)
  weight: number;
}

// 해석 패턴을 나타내는 인터페이스
export interface IInterpretationPattern {
  // 패턴의 고유 ID
  id: string;

  // 패턴의 이름
  name: string;

  // 패턴의 종류
  type: PatternType;

  // 패턴이 적용되는 조건들
  conditions: IInterpretationCondition[];

  // 이 패턴의 중요도
  weight: PatternWeight;

  // 이 패턴이 유효한지
  isActive: boolean;

  // 이 패턴이 언제 만들어졌나요?
  createdAt: Date;

  // 마지막으로 수정된 시간
  updatedAt: Date;
}

// 해석 결과를 나타내는 인터페이스
export interface IInterpretation {
  // 해석의 고유 ID
  id: string;

  // 해석이 속한 카테고리 (예: '성격', '직업운', '건강운')
  category: string;

  // 해석 내용
  content: string;

  // 이 해석의 신뢰도 (0-100%)
  confidence: number;

  // 해석에 사용된 패턴들
  usedPatterns: IInterpretationPattern[];

  // 관련된 오행들
  relatedElements: ElementType[];

  // 해석의 적용 기간
  applicablePeriod?: {
    startDate: Date; // 시작 날짜
    endDate?: Date; // 끝 날짜 (없으면 계속 유효)
  };

  // 구체적인 조언
  recommendations: string[];

  // 주의사항
  cautions?: string[];
}

// 해석의 카테고리를 나타내는 인터페이스
export interface IInterpretationCategory {
  // 카테고리 ID
  id: string;

  // 카테고리 이름 (예: '성격분석', '직업운')
  name: string;

  // 카테고리 설명
  description: string;

  // 표시 순서 (작은 숫자가 먼저 표시됨)
  orderIndex: number;

  // 이 카테고리가 활성화되어 있나요?
  isActive: boolean;
}

// 해석 규칙을 나타내는 인터페이스
export interface IInterpretationRule {
  // 규칙의 고유 ID
  id: string;

  // 규칙 이름
  name: string;

  // 규칙 설명
  description: string;

  // 규칙이 적용되는 우선순위 (1이 가장 높음)
  priority: number;

  // 규칙 적용 조건
  conditions: string[];

  // 규칙 적용 시 실행할 동작
  actions: string[];

  // 예외 사항
  exceptions?: string[];
}

// 해석 이력을 나타내는 인터페이스
export interface IInterpretationHistory {
  // 해석 ID
  interpretationId: string;

  // 언제 해석했나요?
  analyzedAt: Date;

  // 어떤 패턴들이 사용되었나요?
  usedPatterns: string[];

  // 해석의 신뢰도는 얼마였나요?
  confidence: number;

  // 해석이 맞았나요?
  wasAccurate?: boolean;

  // 피드백이나 메모
  feedback?: string;
}

// 여러 해석을 조합한 결과를 나타내는 인터페이스
export interface ICompositeInterpretation {
  // 메인 해석
  mainInterpretation: IInterpretation;

  // 보조 해석들
  supportingInterpretations: IInterpretation[];

  // 전체 신뢰도 (0-100%)
  overallConfidence: number;

  // 해석들 간의 관계
  relationships: {
    type: '보완' | '충돌' | '중립';
    description: string;
  }[];

  // 최종 추천사항
  finalRecommendations: string[];
}
