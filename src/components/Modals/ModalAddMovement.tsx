"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/axios";
import { Transaction } from "@/types/Transaction";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Unit } from "@/types/Unit";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Category } from "@/types/Category";

interface ModalAddMovementProps {
  setOpen: (open: boolean) => void;
  data?: Transaction;
}

export const createTransactionFormSchema = z.object({
  // id: z.string().or(z.undefined()),
  description: z.string().min(1, { message: "Descrição obrigatória" }),
  value: z.string().min(1, { message: "Valor obrigatório" }),
  unit: z.string().min(1, { message: "Categoria obrigatória" }),
  category: z.string().min(1, { message: "Categoria obrigatória" }),
  date: z.string().min(1, { message: "Data obrigatória" }),
  type: z.string().min(1, { message: "Tipo obrigatório" }),
  paymentMethod: z
    .string()
    .min(1, { message: "Forma de pagamento obrigatório" }),
});

export function convertDateTimeToDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export const ModalAddMovement = ({ setOpen, data }: ModalAddMovementProps) => {
  const dataFormatada = convertDateTimeToDate(data?.date);

  const {
    register,
    formState,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<z.infer<typeof createTransactionFormSchema>>({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      description: data?.description,
      value: data?.value,
      unit: String(data?.unitId),
      category: String(data?.categoryId),
      date: dataFormatada,
      type: data?.type,
      paymentMethod: data?.paymentMethod,
    },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { mutateAsync: createNewTransaction, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof createTransactionFormSchema>) => {
      await api.post("/transactions", {
        id: data?.id,
        description: values.description,
        value: values.value,
        unit: values.unit,
        type: values.type,
        date: values.date,
        category: values.category,
        paymentMethod: values.paymentMethod,
      });
    },
    onSuccess(data, variables, context) {
      const cached = queryClient.getQueriesData<Transaction[]>([
        "transactions",
      ]);

      queryClient.invalidateQueries(["transactions"]);
    },
  });

  const { data: units }: { data: Unit[] | undefined } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await api.get("/unit?situacao=A");
      return response.data;
    },
  });

  async function handleNewTransacion(
    transaction: z.infer<typeof createTransactionFormSchema>
  ) {
    try {
      await createNewTransaction(transaction);
      setOpen(false);
      reset();
      toast({
        title: "Movimentação criada",
        description: "Movimentação criada com sucesso",
        color: "green",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Erro",
        description: "Erro ao criar Movimentação",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (data?.unitId) {
      api.get(`/unit/categories?id=${data?.unitId}`).then((response) => {
        setCategories(response.data);
      });
    }
  }, [data]);

  const handleUnitChange = async (unit: string) => {
    setCategories([]);
    setIsLoadingCategories(true);
    try {
      const response = await api.get(`/unit/categories?id=${unit}`);
      setCategories(response.data);
      setIsLoadingCategories(false);
    } catch (err) {
      console.error(err);
      setIsLoadingCategories(false);
    }
    setIsLoadingCategories(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        {data ? (
          <>
            <DialogTitle>Editar movimentação</DialogTitle>
            <DialogDescription className="hidden sm:block">
              Edite uma movimentação.
            </DialogDescription>
          </>
        ) : (
          <>
            <DialogTitle>Adicionar movimentação</DialogTitle>
            <DialogDescription className="hidden sm:block">
              Adicione uma movimentação ao caixa.
            </DialogDescription>
          </>
        )}
      </DialogHeader>
      <form onSubmit={handleSubmit(handleNewTransacion)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {/* <Input {...register("id")} className="" /> */}
          <div>
            <Label>Descrição</Label>
            <Input
              id="description"
              type="text"
              required
              {...register("description")}
            />
          </div>
          <div>
            <Label>Valor</Label>
            <Input
              id="value"
              type="text"
              placeholder="R$ 0,00"
              required
              {...register("value")}
            />
          </div>

          <div>
            <Label>Unidade</Label>
            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={(v) => {
                    onChange(v);
                    handleUnitChange(v);
                  }}
                  value={value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units?.map((unit, index) => (
                      <SelectItem key={index} value={String(unit.id)}>
                        {unit.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="0">Carregando...</SelectItem>
                    ) : (
                      categories?.map((category, index) => (
                        <SelectItem key={index} value={String(category.id)}>
                          {category.description}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Forma de pagamento</Label>
            <Controller
              control={control}
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

          <div>
            <Label>Data</Label>
            <Input
              id="date"
              type="date"
              placeholder="01/01/2020"
              required
              className="block"
              {...register("date")}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => reset()}>
              Cancelar
            </Button>
          </DialogClose>
          {data ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Editar"}
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Adicionar"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
