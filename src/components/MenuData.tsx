import Link from "next/link";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  File,
  FileUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoCard } from "@/components/InfoCard";
import { DataTable } from "@/components/DataTable";
import { columnsMenu } from "./Columns/ColumnsMenu";
import { Transaction } from "@/types/Transaction";
import { inverterData } from "@/utils/inverterData";
import { Installment } from "@/types/Installment";
import { Separator } from "./ui/separator";
import { MenuGrafico, VariationData } from "./MenuGraficos";

interface MenuDataProps {
  data: {
    transactions: Transaction[];
    total: string;
    saidas: string;
    entradas: string;
    valor_contas_a_pagar: string;
    parcelas_a_pagar: Installment[];
    variations: VariationData[];
    monthtoday: string;
  };
}

export const MenuData = ({ data }: MenuDataProps) => {
  const tabledata: Transaction[] =
    data && data.transactions ? data.transactions : [];

  return (
    <main className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <InfoCard
          title="Entradas"
          value={data?.entradas}
          color="text-white"
          bgColor="bg-green-500"
          icon={<ArrowUp className="h-4 w-4 " color="white" />}
        />
        <InfoCard
          title="Saidas"
          value={data?.saidas}
          color="text-white"
          bgColor="bg-red-500"
          icon={<ArrowDown className="h-4 w-4" color="white" />}
        />
        <InfoCard
          title="Total"
          value={data?.total}
          color="text-white"
          bgColor="bg-purple-500"
          icon={<DollarSign className="h-4 w-4" color="white" />}
        />
        <InfoCard
          title="Contas a pagar"
          value={data?.valor_contas_a_pagar}
          color="text-white"
          bgColor="bg-yellow-500"
          icon={<ArrowUpDown className="h-4 w-4" color="white" />}
        />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 ">
        <Card
          className="w-[350px] sm:w-full xl:col-span-2"
          x-chunk="dashboard-01-chunk-4"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-2">
              <CardTitle>Movimentações</CardTitle>
              <CardDescription></CardDescription>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button asChild size="sm" className="flex  gap-1 ">
                <Link href="/movimentacoes">
                  <span className="sr-only sm:not-sr-only">Ver Tudo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <div></div>
            </div>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto">
            <DataTable columns={columnsMenu} data={tabledata} />
          </CardContent>
        </Card>
        <Card className="w-[350px] sm:w-full">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Contas a pagar</CardTitle>
              <CardDescription>Contas a pagar do mês corrente.</CardDescription>
            </div>
            <Button asChild size="sm" className="flex  gap-1 ml-auto">
              <Link href="/movimentacoes">
                <span className="sr-only sm:not-sr-only">Ver Tudo</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 max-h-[300px] overflow-auto">
            {data &&
              data?.parcelas_a_pagar?.map((p) => (
                <>
                  <Separator />
                  <div key={p.id} className="flex flex-col   p-2 rounded-md">
                    <div className="flex justify-between items-center">
                      <h1 className="capitalize font-semibold">
                        {p.description}
                      </h1>
                      <span>{inverterData(p.date)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Parcela: {p.installmentNumber}
                      </span>
                      <span>
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(p.value)}
                      </span>
                    </div>
                  </div>
                </>
              ))}
            {data?.parcelas_a_pagar === undefined && (
              <p className="text-center mt-4 text-muted-foreground">
                Nenhuma conta a pagar
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <MenuGrafico
        data={data.transactions}
        variations={data.variations}
        monthtoday={data.monthtoday}
      />
    </main>
  );
};
