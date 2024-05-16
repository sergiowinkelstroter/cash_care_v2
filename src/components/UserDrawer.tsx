import { User } from "@/types/User";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import { ModalBlockUser } from "./Modals/ModalBlockUser";
import { ModalRetirarBlockUser } from "./Modals/ModalRetirarBlockUser";
import { ModalDeleteUser } from "./Modals/ModalDeleteUser";
import { ModalAdminAlterarSenha } from "./Modals/ModalAdminAlterarSenha";
import { ModalEditUser } from "./Modals/ModalEditUser";

interface UserDrawerProps {
  user?: User;
  setOpenEditUser: (open: boolean) => void;
  openEditUser: boolean;
}

export const UserDrawer = ({
  openEditUser,
  setOpenEditUser,
  user,
}: UserDrawerProps) => {
  if (user === undefined) return null;

  return (
    <DrawerContent className="bg-gray-100/90">
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="flex flex-row  justify-between">
          <div>
            <DrawerTitle>{user.name}</DrawerTitle>
            <DrawerDescription>
              {user.situacao === "A" ? "Ativa" : "Inativa"}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerFooter>
          <Dialog open={openEditUser} onOpenChange={setOpenEditUser}>
            <DialogTrigger asChild>
              <Button variant={"default"}>Editar</Button>
            </DialogTrigger>
            <ModalEditUser setOpen={setOpenEditUser} user={user} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"default"}>Alterar senha</Button>
            </DialogTrigger>
            <ModalAdminAlterarSenha user={user} />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>
                {user.situacao === "A" ? "Bloquear" : "Desbloquear"}
              </Button>
            </AlertDialogTrigger>
            {user.situacao === "A" ? (
              <ModalBlockUser user={user} />
            ) : (
              <ModalRetirarBlockUser user={user} />
            )}
          </AlertDialog>
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Excluir</Button>
            </AlertDialogTrigger>
            <ModalDeleteUser user={user} />
          </AlertDialog> */}
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
};
