// 계절과 절기의 영향력 관련 인터페이스 정의
import { ElementType } from './five-elements.interface';
import { IElementStrength } from './five-elements.interface';

// 하루 중 시간대별 영향
export interface ITimeOfDay {
  // 시간대 구분
  period: '아침' | '낮' | '저녁' | '밤';

  // 영향력 강도 (0-100)
  influence: number;

  // 시간 범위
  range: {
    start: number; // 시작 시각 (0-23)
    end: number; // 종료 시각 (0-23)
  };

  // 해당 시간대의 주도 오행
  dominantElement: ElementType;
}

// 계절의 영향력
export interface ISeasonalInfluence {
  // 계절 이름
  season: '봄' | '여름' | '가을' | '겨울';

  // 각 오행의 세기
  elementStrength: IElementStrength;

  // 계절 특성
  characteristics: string[];

  // 시간대별 영향
  timeInfluence: ITimeOfDay[];

  // 해당 계절의 주도 오행
  dominantElement: ElementType;

  // 해당 계절의 약화 오행
  weakElement: ElementType;

  // 절기 정보
  solarTerms: {
    current: string; // 현재 절기
    next: string; // 다음 절기
    progress: number; // 절기 진행도 (0-100%)
  };
}
