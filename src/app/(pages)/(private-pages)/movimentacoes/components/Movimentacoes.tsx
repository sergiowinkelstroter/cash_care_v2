"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { DataTable } from "@/components/DataTable";
import { columnsTransactions } from "@/components/Columns/ColumnsTransactions";
import { api } from "@/lib/axios";
import { Transaction } from "@/types/Transaction";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { Loading } from "@/components/Loading";
import { useSession } from "next-auth/react";
import { columnsTransactionsBasic } from "@/components/Columns/ColumnsTransactionsBasic";

import { useState } from "react";
import { ModalAddMovement } from "@/components/Modals/ModalAddMovement";

export const createTransactionFormSchema = z.object({
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

export const MovimentacoesCaixa = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const {
    data,
    isLoading: isLoadingTransactions,
  }: { data: Transaction[] | undefined; isLoading: boolean } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transactions");
      return response.data;
    },
  });

  if (isLoadingTransactions || data === undefined) {
    return (
      <div className="w-full flex justify-center items-center mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <Card className="xl:col-span-2 mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <CardTitle>Movimentações</CardTitle>
          <CardDescription>Últimas movimentações</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="w-[92px]">
              Adicionar
            </Button>
          </DialogTrigger>
          <ModalAddMovement setOpen={setOpen} />
        </Dialog>
      </CardHeader>
      <CardContent>
        {session && session.user.perfil == "basic" ? (
          <DataTable columns={columnsTransactionsBasic} data={data} />
        ) : (
          <DataTable columns={columnsTransactions} data={data} />
        )}
      </CardContent>
    </Card>
  );
};
