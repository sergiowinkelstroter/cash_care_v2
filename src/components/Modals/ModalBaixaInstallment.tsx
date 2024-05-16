"use cliente";
import { useInstallment } from "@/hooks/useInstallment";
import {
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "react-query";
import { api } from "@/lib/axios";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Installment } from "@/types/Installment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ModalBaixaInstallmentProps {
  item: Installment;
  setOpen: (open: boolean) => void;
}

const baixaFormSchema = z.object({
  value: z.string().min(1, { message: "Valor obrigatório" }),
  date: z.string().min(1, { message: "Data obrigatória" }),
  paymentMethod: z
    .string()
    .min(1, { message: "Forma de pagamento obrigatório" }),
});

export const ModalBaixaInstallment = ({
  item,
  setOpen,
}: ModalBaixaInstallmentProps) => {
  const form = useForm<z.infer<typeof baixaFormSchema>>({
    resolver: zodResolver(baixaFormSchema),
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: baixarInstallment } = useMutation({
    mutationFn: async (cx: z.infer<typeof baixaFormSchema>) => {
      await api.post(`/payable/installment/${item.id}?status=${item.status}`, {
        valor: cx.value,
        data: cx.date,
        paymentMethod: cx.paymentMethod,
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("payable");
    },
  });

  async function handleBaixarInstallment(cx: z.infer<typeof baixaFormSchema>) {
    try {
      await baixarInstallment(cx);
      form.reset();
      setOpen(false);
      toast({
        title: "Sucesso!",
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

  return (
    <DialogContent className="w-[320px] sm:w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleBaixarInstallment)}>
          <DialogHeader>
            <DialogTitle>Dar baixa</DialogTitle>
            <DialogDescription>
              Parcela {item.description} *{item.installmentNumber}{" "}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <FormField
              control={form.control}
              name="value"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="value">Valor Pagamento:</FormLabel>
                  <FormControl>
                    <Input
                      id="value"
                      type="number"
                      placeholder="R$ 0,00"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Forma de pagamento</Label>
              <Controller
                control={form.control}
                name="paymentMethod"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="cartao_debito">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="transferencia_bancaria">
                        Transferência Bancária
                      </SelectItem>
                      <SelectItem value="boleto_bancario">
                        Boleto Bancário
                      </SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="date">Data Pagamento:</FormLabel>
                  <FormControl>
                    <Input
                      id="date"
                      type="date"
                      placeholder="01/01/2020"
                      required
                      className="block"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Dar baixa
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
