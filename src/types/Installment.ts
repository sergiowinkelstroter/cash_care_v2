import { Transaction } from "./Transaction";

export interface Installment {
  id: string;
  description: string;
  date: string;
  installmentNumber: string;
  value: number;
  status: string;
  moviment?: Transaction;
}
