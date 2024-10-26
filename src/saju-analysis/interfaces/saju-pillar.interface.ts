export interface SajuPillar {
  yearPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  monthPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  dayPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  timePillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
}

export interface Stem {
  id: string;
  name: string;
  koreanName: string;
  element: string;
  yinYang: boolean;
}

export interface Branch {
  id: string;
  name: string;
  koreanName: string;
  element: string;
  season?: string;
}

export interface Pillar {
  heavenlyStem: Stem;
  earthlyBranch: Branch;
}
