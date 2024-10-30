// src/saju-analysis/interfaces/base/saju-pillar.interface.ts

import { ElementType, YinYangType } from './five-elements.interface';

/**
 * 천간(하늘의 기운) 정보를 나타내는 인터페이스
 */
export interface IStem {
  id: string;
  chineseName: string; // 한자 이름 (甲,乙,丙,丁...)
  koreanName: string; // 한글 이름 (갑,을,병,정...)
  element: ElementType;
  yinYang: YinYangType;

  // Prisma 모델과의 호환을 위한 추가 필드
  elementId: string; // Element 모델과의 관계를 위한 ID
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 지지(땅의 기운) 정보를 나타내는 인터페이스
 */
export interface IBranch {
  id: string;
  chineseName: string; // 한자 이름 (子,丑,寅,卯...)
  koreanName: string; // 한글 이름 (자,축,인,묘...)
  element: ElementType;
  timeRange: {
    start: number; // 시작 시각 (0-23)
    end: number; // 종료 시각 (0-23)
  };
  direction: string; // 12방위
  season?: string; // 계절 정보

  // Prisma 모델과의 호환을 위한 추가 필드
  elementId: string; // Element 모델과의 관계를 위한 ID
  solarTermId?: string; // SolarTerm 모델과의 관계를 위한 ID
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 사주의 기둥(천간+지지) 정보를 나타내는 인터페이스
 */
export interface IPillar {
  id?: string;
  type: PillarType;
  stem: IStem;
  branch: IBranch;
  combinedElement: ElementType; // 기둥의 통합 오행 속성
  strength: number; // 기둥의 강도 (0-100)

  // Prisma 모델과의 호환을 위한 추가 필드
  stemId: string; // Stem 모델과의 관계를 위한 ID
  branchId: string; // Branch 모델과의 관계를 위한 ID
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 기둥의 종류를 나타내는 열거형
 */
export enum PillarType {
  YEAR = 'YEAR', // 연주 (년의 기운)
  MONTH = 'MONTH', // 월주 (월의 기운)
  DAY = 'DAY', // 일주 (일의 기운)
  TIME = 'TIME', // 시주 (시의 기운)
}

/**
 * 사주 전체 구조를 나타내는 인터페이스
 */
export interface ISajuPillar {
  id?: string;
  yearPillar: IPillar; // 연주 (년의 기운)
  monthPillar: IPillar; // 월주 (월의 기운)
  dayPillar: IPillar; // 일주 (일의 기운)
  timePillar: IPillar; // 시주 (시의 기운)
  mainElement: ElementType; // 사주의 주도적인 기운
  weakElement: ElementType[]; // 사주의 부족한 기운

  // Prisma 모델과의 호환을 위한 추가 필드
  yearPillarId: string;
  monthPillarId: string;
  dayPillarId: string;
  timePillarId: string;
  userId?: string; // 사용자와의 연결을 위한 선택적 ID
  createdAt?: Date;
  updatedAt?: Date;
}
