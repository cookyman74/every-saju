// analysis-result.interface.ts

// 다른 인터페이스들 불러오기
import { ISajuPillar } from '../base/saju-pillar.interface';
import { IFiveElements, ElementType } from '../base/five-elements.interface';
import { ISeasonalInfluence } from '../base/seasonal-influence.interface';
import { IMajorDestinyInfluence } from './major-destiny-influence.interface';
import { IRealCaseAnalysis } from './real-case-analysis.interface';
import { IInterpretation } from './interpretation/interpretation.interface';

// 오행 분석 결과를 나타내는 인터페이스
export interface IElementAnalysisResult {
  // 강한 오행들 (예: ['목', '화'])
  dominant: ElementType[];

  // 약한 오행들
  weak: ElementType[];

  // 균형 잡힌 오행들
  balanced: ElementType[];

  // 오행별 강도 점수 (100점 만점)
  scores: {
    wood: number; // 목(나무)의 강도
    fire: number; // 화(불)의 강도
    earth: number; // 토(흙)의 강도
    metal: number; // 금(쇠)의 강도
    water: number; // 수(물)의 강도
  };

  // 보완이 필요한 오행에 대한 조언
  recommendations: string[];
}

// 성격 분석 결과를 나타내는 인터페이스
export interface IPersonalityAnalysis {
  // 주요 성격 특성
  mainTraits: string[];

  // 장점들
  strengths: string[];

  // 약점들
  weaknesses: string[];

  // 개선을 위한 조언
  recommendations: string[];

  // 성격 유형 점수 (100점 만점)
  scores: {
    leadership: number; // 리더십
    creativity: number; // 창의성
    sociability: number; // 사교성
    persistence: number; // 끈기
    adaptability: number; // 적응력
  };
}

// 운세 분석 결과를 나타내는 인터페이스
export interface IDestinyAnalysis {
  // 대운 분석 (10년 단위의 큰 운)
  majorDestiny: IMajorDestinyInfluence[];

  // 연운 분석 (해당 년도의 운)
  yearlyDestiny: {
    year: number;
    description: string;
    rating: number; // 운세 등급 (1-10)
  }[];

  // 월운 분석 (달별 운세)
  monthlyDestiny?: {
    month: number;
    description: string;
    rating: number;
  }[];
}

// 전체 분석 결과를 종합하는 메인 인터페이스
export interface IAnalysisResult {
  // 기본 사주 정보
  sajuPillar: ISajuPillar;

  // 오행 분석 결과
  elementAnalysis: IElementAnalysisResult;

  // 성격 분석 결과
  personalityAnalysis: IPersonalityAnalysis;

  // 운세 분석 결과
  destinyAnalysis: IDestinyAnalysis;

  // 계절의 영향 분석
  seasonalInfluence: ISeasonalInfluence;

  // 각 분야별 상세 해석
  interpretations: {
    category: string; // 해석 분야 (예: 사업운, 건강운)
    content: string; // 해석 내용
    confidence: number; // 해석의 신뢰도 (0-100%)
  }[];

  // 실제 사례 기반 분석 (선택 사항)
  realCaseAnalysis?: IRealCaseAnalysis;

  // 분석 결과 생성 시간
  generatedAt: Date;

  // 다음 분석 추천 시기
  nextAnalysisRecommendedAt?: Date;

  // 주의사항이나 특별한 메모
  notes?: string[];
}

// 분석 결과의 신뢰도를 나타내는 인터페이스
export interface IAnalysisConfidence {
  // 전체 신뢰도 점수 (0-100)
  overall: number;

  // 각 부분별 신뢰도
  details: {
    elementAnalysis: number; // 오행 분석 신뢰도
    personality: number; // 성격 분석 신뢰도
    destiny: number; // 운세 분석 신뢰도
  };

  // 신뢰도가 낮은 경우의 이유
  lowConfidenceReasons?: string[];
}

// 분석 결과의 요약 버전을 나타내는 인터페이스
export interface IAnalysisSummary {
  // 핵심 키워드 (3-5개)
  keywords: string[];

  // 주요 특징 요약 (1-2문장)
  mainCharacteristics: string;

  // 현재 시기 핵심 운세
  currentDestiny: string;

  // 주의해야 할 점
  cautionPoints?: string[];

  // 운세 종합 점수 (0-100)
  overallScore: number;
}
