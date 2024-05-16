import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { Unit } from "@/types/Unit";
import { useMutation, useQueryClient } from "react-query";

export function useCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: deleteUnit } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/category/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Unit[] | undefined>(["categorias"], (old) => {
        if (!old) return undefined;
        return old.filter((unit) => unit.id !== variables);
      });
    },
  });

  async function handleDeleteCategory(id: string) {
    try {
      await deleteUnit(id);
      toast({
        title: "Sucesso",
        description: "Categoria deletada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao deletar Categoria",
        variant: "destructive",
      });
    }
  }

  return { handleDeleteCategory };
}
