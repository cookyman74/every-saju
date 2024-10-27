// user/user-context.interface.ts

import { ISajuPillar } from '../base/saju-pillar.interface';
import { IAnalysisResult } from '../analysis/analysis-result.interface';

// 사용자 선호 설정을 나타내는 인터페이스
export interface IUserPreferences {
  // 해석 관련 선호도
  interpretation: {
    // 선호하는 해석 깊이 (상세한 정도)
    detailLevel: 'basic' | 'standard' | 'detailed';

    // 선호하는 해석 스타일
    style: 'traditional' | 'modern' | 'combined';

    // 결과 표시 설정
    display: {
      showChineseCharacters: boolean; // 한자 표시 여부
      showDetailedScores: boolean; // 상세 점수 표시 여부
      showRecommendations: boolean; // 추천사항 표시 여부
    };

    // 관심 분야 (우선순위 순)
    interestedCategories: string[];
  };

  // 알림 설정
  notifications: {
    // 정기 분석 알림
    periodicAnalysis: boolean;

    // 중요 시기 알림
    importantPeriods: boolean;

    // 운세 변화 알림
    destinyChanges: boolean;

    // 알림 방식
    method: 'email' | 'push' | 'both';
  };

  // 언어 설정
  language: {
    primary: string; // 주 사용 언어
    secondary?: string; // 보조 언어
    useHanja: boolean; // 한자 사용 여부
  };
}

// 사용자의 분석 이력을 나타내는 인터페이스
export interface IUserHistory {
  // 과거 분석 결과들
  analyses: {
    date: Date;
    result: IAnalysisResult;
    feedback?: string;
    accuracy?: number; // 사용자 평가 정확도
  }[];

  // 즐겨찾기한 해석들
  favorites: {
    interpretationId: string;
    savedAt: Date;
    note?: string;
  }[];

  // 사용자 피드백 이력
  feedback: {
    date: Date;
    category: string;
    content: string;
    rating: number; // 1-5 평점
  }[];

  // 중요 이벤트 기록
  significantEvents: {
    date: Date;
    event: string;
    impact: string;
    relatedAnalysis?: string;
  }[];
}

// 사용자 컨텍스트를 나타내는 메인 인터페이스
export interface IUserContext {
  // 사용자 기본 정보
  userId: string;
  sajuPillar: ISajuPillar;
  preferences: IUserPreferences;
  history: IUserHistory;

  // 현재 분석 세션 정보
  currentSession?: {
    startTime: Date;
    lastAccessTime: Date;
    analysisCount: number;
  };

  // 사용 통계
  statistics: {
    totalAnalyses: number;
    averageAccuracy: number;
    favoriteCategories: string[];
    lastAnalysisDate: Date;
  };
}
