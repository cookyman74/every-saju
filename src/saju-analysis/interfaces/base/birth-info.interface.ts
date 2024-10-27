// 날짜, 시간, 위치 등 출생 정보 관련 인터페이스 정의
import { TimeZone } from '@vvo/tzdb';
import { IFiveElements } from './five-elements.interface';

// 출생 장소의 위치 정보
export interface ILocation {
  // 위도 (북위/남위, -90 ~ 90)
  latitude: number;

  // 경도 (동경/서경, -180 ~ 180)
  longitude: number;

  // 고도 (해발, 미터 단위, 선택사항)
  altitude?: number;

  // 국가 코드 (예: 'KR', 'US', 'JP')
  countryCode?: string;

  // 도시/지역 이름
  cityName?: string;
}

// 시간 정보
export interface ITimeInfo {
  // 시간 (0-23)
  hour: number;

  // 분 (0-59)
  minute: number;

  // 초 (0-59, 선택사항)
  second?: number;

  // 시간대 (예: 'Asia/Seoul')
  timeZone: TimeZone;

  // 일광절약시간 적용 여부
  isDST?: boolean;
}

// 출생 정보 메인 인터페이스
export interface IBirthInfo {
  // 양력 생년월일
  solarDate: Date;

  // 음력 생년월일 (선택사항)
  lunarDate?: Date;

  // 시간 정보
  timeInfo: ITimeInfo;

  // 출생 장소 정보
  location: ILocation;

  // 음력 윤달 여부
  isLeapMonth?: boolean;

  // 태어난 시점의 절기 정보
  solarTerm?: ISolarTerm;
}

// 절기 정보 인터페이스
export interface ISolarTerm {
  // 절기 이름 (예: '입춘', '청명')
  name: string;

  // 절기 한자 이름
  chineseName: string;

  // 절기가 시작되는 태양의 황경도 (0-360도)
  solarDegree: number;

  // 대응되는 오행
  element: IFiveElements;

  // 해당 절기의 시작 시간
  startDate: Date;

  // 해당 절기의 종료 시간
  endDate: Date;
}
