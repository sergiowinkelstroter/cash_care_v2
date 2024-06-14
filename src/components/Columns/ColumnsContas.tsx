"use client";

import { ColumnDef } from "@tanstack/react-table";
import { inverterData } from "@/utils/inverterData";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DollarSign, Pencil, Trash2Icon } from "lucide-react";
import { ModalDeleteInstallment } from "../Modals/ModalInstallmentDelete";
import { ModalBaixaInstallment } from "../Modals/ModalBaixaInstallment";
import { ModalRetirarBaixaInstallment } from "../Modals/ModalRetirarBaixaInstallment";
import { Installment } from "@/types/Installment";
import { Unit } from "@/types/Unit";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Payable } from "@/types/Payable";
import { Category } from "@/types/Category";
import { ModalDeletePayable } from "../Modals/ModalDeletePayable";
import { ModalAddConta } from "../Modals/ModalAddConta";
import { objectFilterFn } from "@/utils/objectFilterFn";

const TableCellComponent = ({ original }: { original: Payable }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Pencil />
            <span className="sr-only">Edit</span>
          </Button>
        </DialogTrigger>
        <ModalAddConta setOpen={setOpen} conta={original} />
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Trash2Icon />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <ModalDeletePayable
          id={original.id}
          description={original.description}
        />
      </AlertDialog>
    </div>
  );
};

export const columnsContas: ColumnDef<Payable>[] = [
  {
    accessorKey: "id",
    header: "#",
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
    accessorKey: "numberOfInstallments",
    header: "N° Parcela",
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
    accessorKey: "totalValue",
    header: "Valor Total",
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
      return <TableCellComponent original={original} />;
    },
  },
];
