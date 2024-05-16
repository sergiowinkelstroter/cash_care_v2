"use client";

import { Transaction } from "@/types/Transaction";
import { ColumnDef } from "@tanstack/react-table";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { inverterData } from "@/utils/inverterData";
import { Category } from "@/types/Category";

export const columnsMenu: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate">{capitalizeFirstLetter(value)}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate">{value}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate">{inverterData(value)}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ getValue }) => {
      const value = getValue<Category>();
      return <div className="truncate">{value.description}</div>;
    },
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return <div className="truncate">{formattedValue}</div>;
    },
  },
];
