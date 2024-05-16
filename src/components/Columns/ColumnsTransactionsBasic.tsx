"use client";

import { Transaction } from "@/types/Transaction";
import { ColumnDef } from "@tanstack/react-table";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { inverterData } from "@/utils/inverterData";
import { Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { ModalDeleteTransaction } from "../Modals/ModaDeleteTransaction";
import { Button } from "../ui/button";

export const columnsTransactionsBasic: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return capitalizeFirstLetter(value);
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return inverterData(value);
    },
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      const valor_formatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return valor_formatado;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"ghost"}>
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <ModalDeleteTransaction id={original.id} />
          </AlertDialog>
        </div>
      );
    },
  },
];
