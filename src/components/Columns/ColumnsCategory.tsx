"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Pencil, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteUnit } from "../Modals/ModalDeleteUnit";
import { Category } from "@/types/Category";
import { ModalDeleteCategory } from "../Modals/ModalDeleteCategory";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { ModalAddCategory } from "../Modals/ModalAddCategory";

const TableCellComponent = ({ original }: { original: Category }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Pencil />
          </Button>
        </DialogTrigger>
        <ModalAddCategory category={original} setOpen={setOpen} />
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"ghost"}>
            <Trash2Icon />
          </Button>
        </AlertDialogTrigger>
        <ModalDeleteCategory
          id={original.id}
          description={original.description}
        />
      </AlertDialog>
    </div>
  );
};

export const columnsCategory: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: value }}
        ></div>
      );
    },
  },
  {
    accessorKey: "situacao",
    header: "Situação",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value === "A" ? "Ativa" : "Inativa";
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <TableCellComponent original={original} />;
    },
  },
];
