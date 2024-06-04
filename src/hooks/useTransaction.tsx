import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { Transaction } from "@/types/Transaction";
import { useMutation, useQueryClient } from "react-query";

export function useTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: deleteTransaction } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Transaction[] | undefined>(
        ["transactions"],
        (old) => {
          if (!old) return undefined;
          return old.filter((transaction) => transaction.id !== variables);
        }
      );
    },
  });

  async function handleDeleteTransaction(id: string) {
    try {
      await deleteTransaction(id);
      toast({
        title: "Movimentação deletada",
        description: "Movimentação deletada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao deletar movimentação",
        variant: "destructive",
      });
    }
  }

  return { handleDeleteTransaction };
}
