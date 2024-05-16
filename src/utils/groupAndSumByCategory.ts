import { Transaction } from "@/types/Transaction";

interface GroupedValue {
  name: string;
  value: number;
  color: string;
}

export function groupAndSumByCategory(array: Transaction[]): GroupedValue[] {
  const groupedValues: { [key: number]: GroupedValue } = {};

  array.forEach((item) => {
    const categoryId: number = item.categoryId;
    const value = parseFloat(item.value.replace(",", "."));

    if (groupedValues[categoryId]) {
      groupedValues[categoryId].value += value;
    } else {
      groupedValues[categoryId] = {
        name: `${item.category.description}`,
        value: value,
        color: item.category.color || "#f97316",
      };
    }
  });

  return Object.values(groupedValues);
}
