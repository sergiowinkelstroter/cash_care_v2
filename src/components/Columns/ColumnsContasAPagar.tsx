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

const TableCellComponent = ({ original }: { original: Installment }) => {
  const [open, setOpen] = useState(false);

  if (original.status === "A") {
    return (
      <div className="flex gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={"ghost"}>
              <DollarSign />
            </Button>
          </DialogTrigger>
          <ModalBaixaInstallment item={original} setOpen={setOpen} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"}>
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
          <ModalDeleteInstallment id={original.id} />
        </AlertDialog>
      </div>
    );
  } else {
    return (
      <div className="flex gap-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"}>
              <DollarSign />
            </Button>
          </AlertDialogTrigger>
          <ModalRetirarBaixaInstallment item={original} />
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"}>
              <Trash2Icon />
            </Button>
          </AlertDialogTrigger>
          <ModalDeleteInstallment id={original.id} />
        </AlertDialog>
      </div>
    );
  }
};

export const columnsContasAPagar: ColumnDef<Installment>[] = [
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
    accessorKey: "installmentNumber",
    header: "Parcela",
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
  },
  {
    accessorKey: "date",
    header: "Data venc.",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return inverterData(value);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value === "P") {
        return (
          <div className="bg-green-500 w-8 rounded text-white text-center p-2">
            P
          </div>
        );
      } else if (value === "A") {
        return (
          <div className="bg-yellow-500 w-8 rounded text-white text-center p-2">
            A
          </div>
        );
      }
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
      return <TableCellComponent original={original} />;
    },
  },
];
