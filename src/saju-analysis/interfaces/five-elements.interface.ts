export interface ElementRelationship {
  generates: string[]; // 상생
  controls: string[]; // 상극
  weakens: string[]; // 상수
}

export interface FiveElements {
  id: string;
  name: string;
  koreanName: string;
  characteristics: {
    nature: string;
    direction: string;
    season: string;
    color: string;
    energy: string;
  };
  relationships: ElementRelationship;
}
