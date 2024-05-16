import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { Installment } from "@/types/Installment";
import { useMutation, useQueryClient } from "react-query";

interface PropsUrl {
  id: string;
  status: string;
  valor?: number;
  data?: string;
}
export function useInstallment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: deleteInstallment } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/payable/installment/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<Installment[] | undefined>(
        ["payable"],
        (old) => {
          if (!old) return undefined;
          return old.filter((installment) => installment.id !== variables);
        }
      );
    },
  });

  async function handleDeleteInstallment(id: string) {
    try {
      await deleteInstallment(id);
      toast({
        title: "Sucesso",
        description: "Parcela deletada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao deletar parcela",
        variant: "destructive",
      });
    }
  }

  const { mutateAsync: baixarInstallment } = useMutation({
    mutationFn: async (cx: PropsUrl) => {
      await api.post(`/payable/installment/${cx.id}?status=${cx.status}`, {
        valor: cx.valor,
        data: cx.data,
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("payable");
    },
  });

  async function handleBaixarInstallment(
    id: string,
    status: string,
    valor?: number,
    data?: string
  ) {
    let cx = {
      id,
      status,
      valor,
      data,
    };
    try {
      await baixarInstallment(cx);
      toast({
        title: "Parcela baixada",
        description: "Parcela baixada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro dar baixa parcela",
        variant: "destructive",
      });
    }
  }

  const { mutateAsync: retirarBaixaInstallment } = useMutation({
    mutationFn: async (cx: PropsUrl) => {
      await api.post(`/payable/installment/${cx.id}?status=${cx.status}`, {
        valor: cx.valor,
        data: cx.data,
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("payable");
    },
  });

  async function handleRetirarBaixarInstallment(id: string, status: string) {
    let cx = {
      id,
      status,
    };
    try {
      await retirarBaixaInstallment(cx);
      toast({
        title: "Sucesso",
        description: "Retirada feita com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao tentar retirar baixa da parcela",
        variant: "destructive",
      });
    }
  }

  return {
    handleDeleteInstallment,
    handleBaixarInstallment,
    handleRetirarBaixarInstallment,
  };
}
