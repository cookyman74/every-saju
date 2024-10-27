// 오행(목,화,토,금,수) 관련 인터페이스 정의

// 오행의 기본 타입 정의
export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type ElementKoreanType = '목' | '화' | '토' | '금' | '수';
export type YinYangType = 'yin' | 'yang';

// 오행의 기본 속성
export interface IElementBase {
  // 오행 타입
  type: ElementType;

  // 한글 이름
  koreanName: ElementKoreanType;

  // 음양 구분
  yinYang: YinYangType;
}

// 오행 간의 관계
export interface IElementRelation {
  // 생성하는 오행 (예: 목생화)
  generates: ElementType[];

  // 극하는 오행 (예: 금극목)
  controls: ElementType[];

  // 극을 받는 오행
  controlledBy: ElementType[];

  // 상생 강도 (0-100)
  generationStrength: number;

  // 상극 강도 (0-100)
  controlStrength: number;
}

// 오행의 특성
export interface IElementCharacteristics {
  // 기본 특성
  nature: string;

  // 방향성
  direction: '동' | '남' | '중앙' | '서' | '북';

  // 계절
  season: '봄' | '여름' | '늦여름' | '가을' | '겨울';

  // 색상
  color: string;

  // 맛
  taste: string;

  // 특징적 성질
  properties: string[];
}

// 오행의 강도를 나타내는 인터페이스
export interface IElementStrength {
  wood: number; // 목(木)의 강도 (0-100)
  fire: number; // 화(火)의 강도 (0-100)
  earth: number; // 토(土)의 강도 (0-100)
  metal: number; // 금(金)의 강도 (0-100)
  water: number; // 수(水)의 강도 (0-100)
}

// 통합된 오행 정보 인터페이스
export interface IFiveElements {
  // 기본 정보
  base: IElementBase;

  // 오행 강도
  strength: IElementStrength;

  // 오행 관계
  relations: Record<ElementType, IElementRelation>;

  // 오행 특성
  characteristics: IElementCharacteristics;
}
