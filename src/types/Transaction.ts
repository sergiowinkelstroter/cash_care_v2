import { Category } from "./Category";

export interface Transaction {
  id?: string;
  description: string;
  value: string;
  categoryId: number;
  type: string;
  date: string;
  paymentMethod: string;
  category: Category;
  unitId: number;
}
