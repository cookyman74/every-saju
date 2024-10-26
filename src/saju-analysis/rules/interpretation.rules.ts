export const InterpretationRules = {
  combineInterpretations: (patterns: any[]): any[] => {
    const categoryGroups = patterns.reduce((acc, pattern) => {
      const category = pattern.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(pattern);
      return acc;
    }, {});

    return Object.entries(categoryGroups).map(([category, patterns]) => ({
      category,
      content: combineContent(patterns as any[]),
      confidence: calculateConfidence(patterns as any[]),
    }));
  },

  validateInterpretation: (interpretation: any): boolean => {
    const requiredFields = ['category', 'content', 'confidence'];
    return requiredFields.every(
      (field) =>
        interpretation.hasOwnProperty(field) && interpretation[field] !== null,
    );
  },
};

function combineContent(patterns: any[]): string {
  return patterns
    .sort((a, b) => b.weight - a.weight)
    .map((p) => p.content)
    .join('\n\n');
}

function calculateConfidence(patterns: any[]): number {
  const weights = patterns.map((p) => p.weight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const maxPossibleWeight = patterns.length * 10; // 가정: 최대 가중치는 10

  return (totalWeight / maxPossibleWeight) * 100;
}
