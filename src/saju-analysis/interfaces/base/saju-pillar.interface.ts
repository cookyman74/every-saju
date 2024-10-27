// 사주의 기본 구성요소(천간,지지) 및 사주 기둥 관련 인터페이스 정의
import { ElementType, YinYangType } from './five-elements.interface';

// 천간 정보
export interface IStem {
  // 천간 ID
  id: string;

  // 한자 이름 (예: 甲,乙,丙,丁...)
  chineseName: string;

  // 한글 이름 (예: 갑,을,병,정...)
  koreanName: string;

  // 대응되는 오행
  element: ElementType;

  // 음양 구분
  yinYang: YinYangType;
}

// 지지 정보
export interface IBranch {
  // 지지 ID
  id: string;

  // 한자 이름 (예: 子,丑,寅,卯...)
  chineseName: string;

  // 한글 이름 (예: 자,축,인,묘...)
  koreanName: string;

  // 대응되는 오행
  element: ElementType;

  // 시간 범위
  timeRange: {
    start: number; // 시작 시각 (0-23)
    end: number; // 종료 시각 (0-23)
  };

  // 대응되는 방향 (12방위)
  direction: string;

  // 계절 정보
  season?: string;
}

// 하나의 사주 기둥 (천간+지지)
export interface IPillar {
  // 천간 정보
  stem: IStem;

  // 지지 정보
  branch: IBranch;

  // 기둥의 통합 오행 속성
  combinedElement: ElementType;

  // 기둥의 강도 (0-100)
  strength: number;
}

// 사주 전체 구조
export interface ISajuPillar {
  // 연주 (년의 기운)
  yearPillar: IPillar;

  // 월주 (월의 기운)
  monthPillar: IPillar;

  // 일주 (일의 기운)
  dayPillar: IPillar;

  // 시주 (시의 기운)
  timePillar: IPillar;

  // 사주의 주도적인 기운
  mainElement: ElementType;

  // 사주의 부족한 기운
  weakElement: ElementType[];
}
