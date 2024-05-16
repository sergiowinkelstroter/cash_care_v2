import { User } from "@/types/User";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Ban, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { ModalBlockUser } from "../Modals/ModalBlockUser";
import { ModalRetirarBlockUser } from "../Modals/ModalRetirarBlockUser";

function TableCellComponent({ original }: { original: User }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Pencil />
          </Button>
        </DialogTrigger>
        {/* <ModalEditUser setOpen={setOpen} data={original} /> */}
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"ghost"}>
            <Ban />
          </Button>
        </AlertDialogTrigger>
        {original.situacao === "A" ? (
          <ModalBlockUser user={original} />
        ) : (
          <ModalRetirarBlockUser user={original} />
        )}
      </AlertDialog>
    </div>
  );
}

export const columnsUser: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate">{value}</div>;
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
    accessorKey: "perfil",
    header: "Perfil",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <div className="truncate capitalize">{value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <TableCellComponent original={original} />;
    },
  },
];
