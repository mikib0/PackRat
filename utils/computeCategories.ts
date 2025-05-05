export function convertToGrams(weight: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'kg':
      return weight * 1000;
    case 'g':
      return weight;
    case 'oz':
      return weight * 28.3495;
    case 'lb':
      return weight * 453.592;
    default:
      return weight;
  }
}

export function computeCategorySummaries(items: any[], totalWeight: number) {
  const categoryMap: Record<
    string,
    {
      weightInGrams: number;
      items: number;
      originalWeight: number;
      weightUnit: string;
    }
  > = {};

  items.forEach((item) => {
    const category = item.category.trim() || 'Other';
    const weight = item.weight ?? 0;
    const unit = item.weightUnit ?? 'g';
    const convertedWeight = convertToGrams(weight, unit) * item.quantity;

    if (!categoryMap[category]) {
      categoryMap[category] = {
        weightInGrams: 0,
        items: 0,
        originalWeight: weight,
        weightUnit: unit,
      };
    }

    categoryMap[category].weightInGrams += convertedWeight;
    categoryMap[category].items += 1;
  });

  return Object.entries(categoryMap).map(([name, data]) => {
    const percentage = totalWeight > 0 ? (data.weightInGrams / totalWeight) * 100 : 0;

    return {
      name,
      items: data.items,
      weight: {
        value: data.originalWeight,
        unit: data.weightUnit,
      },
      percentage: Math.round(percentage),
    };
  });
}
