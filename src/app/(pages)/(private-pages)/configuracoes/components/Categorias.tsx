"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { useQuery } from "react-query";

import { DataTable } from "@/components/DataTable";
import { Loading } from "@/components/Loading";
import { columnsCategory } from "@/components/Columns/ColumnsCategory";
import { useState } from "react";
import { ModalAddCategory } from "@/components/Modals/ModalAddCategory";

export const Categoria = () => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await api.get("/category");
      return response.data;
    },
  });

  if (data === undefined) {
    return (
      <div className="w-full flex justify-center items-center mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Categorias</CardTitle>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="w-[92px]">
              Adicionar
            </Button>
          </DialogTrigger>
          <ModalAddCategory setOpen={setOpen} />
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable columns={columnsCategory} data={data} />
      </CardContent>
    </Card>
  );
};
