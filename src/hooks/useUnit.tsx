import { useToast } from "@/components/ui/use-toast";
import { UnitContext } from "@/context/UnitContext";
import { api } from "@/lib/axios";
import { Unit } from "@/types/Unit";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

export function useUnit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setOpenDrawer } = useContext(UnitContext);

  const { mutateAsync: deleteUnit } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/unit/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Unit[] | undefined>(["unidades"], (old) => {
        if (!old) return undefined;
        return old.filter((unit) => unit.id !== variables);
      });
    },
  });

  async function handleDeleteUnit(id: string) {
    try {
      await deleteUnit(id);
      setOpenDrawer(false);
      toast({
        title: "Unidade deletada",
        description: "Unidade deletada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao deletar Unidade",
        variant: "destructive",
      });
    }
  }

  return { handleDeleteUnit };
}
