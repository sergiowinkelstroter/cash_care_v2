import React, { useState } from "react";
import { useQuery } from "react-query";
import { api } from "@/lib/axios";
import { DataTable } from "@/components/DataTable";
import { columnsContasAPagar } from "@/components/Columns/ColumnsContasAPagar";
import { Loading } from "@/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Installment } from "@/types/Installment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Payable } from "@/types/Payable";
import { columnsContas } from "@/components/Columns/ColumnsContas";
import { ModalAddConta } from "@/components/Modals/ModalAddConta";

export function ContasAPagar() {
  const [open, setOpen] = useState(false);
  const { data }: { data: Installment[] | undefined } = useQuery({
    queryKey: ["payable"],
    queryFn: async () => {
      const response = await api.get("/payable/installment");
      return response.data;
    },
  });

  const { data: contas }: { data: Payable[] | undefined } = useQuery({
    queryKey: ["payables"],
    queryFn: async () => {
      const response = await api.get("/payable");
      return response.data;
    },
  });

  if (data === undefined || contas === undefined) {
    return (
      <div className="w-full flex justify-center items-center mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <CardTitle>Contas a Pagar</CardTitle>
          <CardDescription>Últimas parcelas a pagar</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="w-[92px]">
              Adicionar
            </Button>
          </DialogTrigger>
          <ModalAddConta setOpen={setOpen} />
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">Parcelas</TabsTrigger>
            <TabsTrigger value="2">Contas</TabsTrigger>
          </TabsList>

          <TabsContent value="1">
            <DataTable columns={columnsContasAPagar} data={data} />
          </TabsContent>
          <TabsContent value="2">
            <DataTable columns={columnsContas} data={contas} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
