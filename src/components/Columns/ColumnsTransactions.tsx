"use client";

import { Transaction } from "@/types/Transaction";
import { ColumnDef } from "@tanstack/react-table";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { inverterData } from "@/utils/inverterData";
import { Pencil, Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { ModalDeleteTransaction } from "../Modals/ModaDeleteTransaction";
import { Button } from "../ui/button";
import { Category } from "@/types/Category";
import { Unit } from "@/types/Unit";
import { Dialog } from "@radix-ui/react-dialog";
import { ModalAddMovement } from "../Modals/ModalAddMovement";
import { DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { objectFilterFn } from "@/utils/objectFilterFn";

const TableCellComponent = ({ original }: { original: Transaction }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Pencil />
          </Button>
        </DialogTrigger>
        <ModalAddMovement setOpen={setOpen} data={original} />
      </Dialog>
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
};

export const columnsTransactions: ColumnDef<Transaction>[] = [
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
    accessorKey: "unit",
    header: "Unidade",
    cell: ({ getValue }) => {
      const value = getValue<Unit>();
      return <div className="truncate">{value.description}</div>;
    },
    filterFn: objectFilterFn,
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ getValue }) => {
      const value = getValue<Category>();
      return <div className="truncate">{value.description}</div>;
    },
    filterFn: objectFilterFn,
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
    accessorKey: "paymentMethod",
    header: "Forma de pagamento",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate">{value || "Não informada"}</div>;
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
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <TableCellComponent original={original} />;
    },
  },
];
