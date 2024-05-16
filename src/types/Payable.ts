import { Installment } from "./Installment";
import { Category } from "./Category";
import { Unit } from "./Unit";

export interface Payable {
  id: string;
  description: string;
  totalValue: string;
  numberOfInstallments: number;
  dates: string[];
  categoryId: string;
  unitId: string;
  unit: Unit;
  category: Category;
  Installment: Installment[];
  uniqueDate: number;
}
