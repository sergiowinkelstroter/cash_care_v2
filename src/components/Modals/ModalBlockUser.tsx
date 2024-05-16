import { User } from "@/types/User";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { api } from "@/lib/axios";
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { AdminContext } from "@/context/AdminContext";
import { useContext } from "react";

interface ModalBlockUserProps {
  user: User;
}

export const ModalBlockUser = ({ user }: ModalBlockUserProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setOpenUserDrawer } = useContext(AdminContext);

  const { mutateAsync: blockUser } = useMutation({
    mutationFn: async (value: number) => {
      await api.put(`/users?id=${value}&situacao=${user.situacao}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleBlockUser() {
    if (user.id) {
      try {
        await blockUser(user.id);
        setOpenUserDrawer(false);
        toast({
          title: "Sucesso",
          description: "Usuário bloqueado com sucesso",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Erro",
          description: "Erro ao bloquear usuário",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Bloquear usuário {user.name}?</AlertDialogTitle>
        <AlertDialogDescription>
          Bloqueando este usuário, ele não podera mais acessar o sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleBlockUser}>
          Bloquear
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
