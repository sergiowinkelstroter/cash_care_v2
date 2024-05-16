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
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { api } from "@/lib/axios";
import { useContext } from "react";
import { AdminContext } from "@/context/AdminContext";

export const ModalDeleteUser = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setOpenUserDrawer } = useContext(AdminContext);

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: async (value: number) => {
      await api.delete(`/users?id=${value}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleDeleteUser(id: number) {
    try {
      await deleteUser(id);
      setOpenUserDrawer(false);
      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Deletar usuário {user.name}</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja deletar este usuário?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (user.id) {
              await handleDeleteUser(user.id);
            }
          }}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
