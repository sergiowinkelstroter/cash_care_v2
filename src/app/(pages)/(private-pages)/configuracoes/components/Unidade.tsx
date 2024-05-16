"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api } from "@/lib/axios";
import { useQuery } from "react-query";
import { Loading } from "@/components/Loading";
import { UnitList } from "@/components/UnitList";
import { ModalAddUnit } from "@/components/Modals/ModalAddUnit";
import { Unit } from "@/types/Unit";

export const Unidade = () => {
  const { data } = useQuery({
    queryKey: ["unidades"],
    queryFn: async () => {
      const response = await api.get("/unit");
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

  const unidadesAtivas = data.filter(
    (unidade: Unit) => unidade.situacao === "A"
  );
  const threeUnits = unidadesAtivas.length >= 3;

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Unidades</CardTitle>
          <CardDescription className="hidden sm:block">
            As unidades são áreas separadas onde você pode gerenciar suas
            finanças, como empresas, projetos ou residências, de forma
            independente e organizada.
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="w-[92px]"
              disabled={threeUnits}
            >
              Adicionar
            </Button>
          </AlertDialogTrigger>
          <ModalAddUnit />
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <UnitList data={data} />
      </CardContent>
    </Card>
  );
};
