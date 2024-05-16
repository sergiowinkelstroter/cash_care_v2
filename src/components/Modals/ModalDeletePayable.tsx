import { api } from "@/lib/axios";
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import { useToast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { Payable } from "@/types/Payable";

interface ModalDeletePayableProps {
  id: string | undefined;
  description: string | undefined;
}

export const ModalDeletePayable = ({
  id,
  description,
}: ModalDeletePayableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: deletePayable } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/payable?id=${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Payable[] | undefined>(["payables"], (old) => {
        if (!old) return undefined;
        return old.filter((payable) => payable.id !== variables);
      });
    },
  });

  async function handleDeletePayable() {
    if (!id) return;
    try {
      await deletePayable(id);
      toast({
        title: "Sucesso",
        description: "Conta deletada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao deletar conta",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Deletar conta <b>{description}</b>?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Excluindo esta conta, todas as parcelas associadas a ela serão
          removidas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleDeletePayable()}>
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
