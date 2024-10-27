// major-destiny-influence.interface.ts

// 필요한 다른 인터페이스들 불러오기
import { ElementType } from '../base/five-elements.interface';
import { IStem, IBranch } from '../base/saju-pillar.interface';

// 대운 기간을 나타내는 인터페이스
// (대운은 10년 단위로 변화하는 큰 운세를 의미해요)
export interface IMajorDestinyPeriod {
  // 대운이 시작되는 나이
  startAge: number;

  // 대운이 끝나는 나이
  endAge: number;

  // 대운의 시작 날짜
  startDate: Date;

  // 대운의 끝나는 날짜
  endDate: Date;

  // 이 대운의 천간 (하늘의 기운)
  stem: IStem;

  // 이 대운의 지지 (땅의 기운)
  branch: IBranch;
}

// 대운의 영향력을 나타내는 인터페이스
export interface IMajorDestinyInfluence {
  // 대운의 기간 정보
  period: IMajorDestinyPeriod;

  // 이 대운의 영향력 유형
  // (예: '좋음', '보통', '주의 필요')
  type: 'favorable' | 'neutral' | 'unfavorable';

  // 영향력의 강도 (0부터 100까지의 숫자)
  // (숫자가 클수록 영향이 더 강해요)
  strength: number;

  // 이 대운의 주요 특징 설명
  description: string;

  // 이 대운에서 강해지는 오행
  strongElements: ElementType[];

  // 이 대운에서 약해지는 오행
  weakElements: ElementType[];

  // 각 분야별 운세 점수 (100점 만점)
  scores: {
    overall: number; // 전체적인 운세
    career: number; // 직장/사업운
    wealth: number; // 재물운
    relationship: number; // 대인관계운
    health: number; // 건강운
    study: number; // 학업운
  };

  // 이 대운에서 조심해야 할 점들
  cautionPoints: string[];

  // 이 대운을 잘 보내기 위한 조언
  recommendations: string[];

  // 특별히 좋은 시기들
  // (이 대운 중에서도 특별히 좋은 시기를 알려줘요)
  favorablePeriods?: {
    startDate: Date; // 좋은 시기 시작
    endDate: Date; // 좋은 시기 끝
    reason: string; // 왜 좋은 시기인지 설명
    recommendation: string; // 이 시기를 어떻게 활용하면 좋을지 조언
  }[];

  // 조심해야 할 시기들
  // (이 대운 중에서 특별히 조심해야 할 시기를 알려줘요)
  cautionPeriods?: {
    startDate: Date; // 조심할 시기 시작
    endDate: Date; // 조심할 시기 끝
    reason: string; // 왜 조심해야 하는지 설명
    advice: string; // 이 시기를 어떻게 대처하면 좋을지 조언
  }[];

  // 이 대운과 본명(타고난 사주)과의 관계
  relationWithBasicNature: {
    type: string; // 관계 유형 (예: '상생', '상충', '중성')
    description: string; // 관계 설명
    impact: string; // 영향력 설명
  };

  // 월운과의 상호작용
  // (매달의 작은 운세가 이 대운과 어떻게 어우러지는지)
  monthlyInteractions: {
    favorableMonths: number[]; // 이 대운에서 좋은 달들
    unfavorableMonths: number[]; // 이 대운에서 조심할 달들
    description: string; // 상호작용 설명
  };

  // 계절별 영향
  // (봄,여름,가을,겨울별로 이 대운이 어떻게 달라지는지)
  seasonalEffects: {
    spring: string; // 봄철 영향
    summer: string; // 여름철 영향
    autumn: string; // 가을철 영향
    winter: string; // 겨울철 영향
  };
}

// 대운의 변화 시점을 분석하는 인터페이스
export interface IMajorDestinyTransition {
  // 이전 대운 정보
  previousDestiny: IMajorDestinyInfluence;

  // 다음 대운 정보
  nextDestiny: IMajorDestinyInfluence;

  // 변화의 강도 (0-100)
  // (숫자가 클수록 변화가 크다는 뜻이에요)
  transitionStrength: number;

  // 변화 시기 설명
  transitionDescription: string;

  // 변화 시기에 주의할 점
  transitionCautions: string[];

  // 변화에 대한 준비 사항
  preparations: string[];
}
