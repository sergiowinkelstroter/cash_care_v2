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
import { useContext } from "react";
import { AdminContext } from "@/context/AdminContext";

interface ModalBlockUserProps {
  user: User;
}

export const ModalRetirarBlockUser = ({ user }: ModalBlockUserProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setOpenUserDrawer } = useContext(AdminContext);

  const { mutateAsync: handleUnBlockUser } = useMutation({
    mutationFn: async (value: number) => {
      await api.put(`/users?id=${value}&situacao=${user.situacao}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleRetirarBlockUser() {
    if (user.id) {
      try {
        await handleUnBlockUser(user.id);
        setOpenUserDrawer(false);
        toast({
          title: "Sucesso",
          description: "Usuário desbloqueado com sucesso",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Erro",
          description: "Erro ao desbloquear usuário",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Desbloquear usuário {user.name}?</AlertDialogTitle>
        <AlertDialogDescription>
          Desbloqueando este usuário, ele podera acessar o sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleRetirarBlockUser}>
          Desbloquear
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
