export const PatternMatchingRules = {
  validateConditions: (conditions: any): boolean => {
    const requiredFields = ['stem', 'branch', 'element'];
    return requiredFields.every((field) => conditions.hasOwnProperty(field));
  },

  calculateMatchScore: (pattern: any, input: any): number => {
    let score = 0;

    // 천간 매칭
    if (pattern.stem === input.stem) {
      score += 2;
    }

    // 지지 매칭
    if (pattern.branch === input.branch) {
      score += 2;
    }

    // 오행 매칭
    if (pattern.element === input.element) {
      score += 1.5;
    }

    // 계절 매칭
    if (pattern.season === input.season) {
      score += 1;
    }

    return score;
  },

  prioritizePatterns: (patterns: any[]): any[] => {
    return patterns.sort((a, b) => {
      if (a.weight !== b.weight) {
        return b.weight - a.weight;
      }
      return b.matchScore - a.matchScore;
    });
  },
};
