"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Loading } from "@/components/Loading";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { MenuData } from "@/components/MenuData";
import { api } from "@/lib/axios";
import { Unit } from "@/types/Unit";
import { Transaction } from "@/types/Transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Data {
  transactions: Transaction[];
  total: string;
  saidas: string;
  entradas: string;
  emprestimos: string;
  monthtoday: string;
}

export function MenuClassic({ userId }: { userId: number | undefined }) {
  const currentDate = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentDate);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: unitsData, isLoading: isLoadingUnits } = useQuery<Unit[]>(
    "units",
    async () => {
      const response = await api.get("/unit?situacao=A");
      return response.data;
    }
  );

  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    if (unitsData && unitsData.length > 0 && !selectedUnit) {
      setSelectedUnit(unitsData[0].id);
    }
  }, [unitsData, selectedUnit]);

  const { data, isLoading } = useQuery({
    queryKey: ["painel", selectedUnit, selectedMonth],
    enabled: !!selectedUnit,
    queryFn: async ({ queryKey }) => {
      const [_, selectedUnit, selectedMonth] = queryKey;
      const response = await api.get(
        `/painel?unit=${selectedUnit}&month=${selectedMonth}`
      );
      return response.data;
    },
  });

  const { mutateAsync: unitchange } = useMutation({
    mutationFn: async (values: string) => {
      await api.get(`/painel?unit=${values}&month=${selectedMonth}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["painel", selectedUnit, selectedMonth]);
      toast({
        title: "Sucesso",
        description: "Categoria alterada com sucesso",
        color: "green",
      });
    },
  });

  const { mutateAsync: monthchange } = useMutation({
    mutationFn: async (values: string) => {
      await api.get(`/painel?unit=${selectedUnit}&month=${values}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["painel", selectedUnit, selectedMonth]);
      toast({
        title: "Sucesso",
        description: "Mês alterado com sucesso",
        color: "green",
      });
    },
  });

  if (data === undefined || isLoadingUnits) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  async function handleUnitChange(c: string) {
    setSelectedUnit(c);
    try {
      await unitchange(selectedUnit);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar categoria",
        variant: "destructive",
      });
    }
  }

  async function handleMonthChange(c: string) {
    setSelectedMonth(c);
    try {
      await monthchange(c);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar mês",
        variant: "destructive",
      });
    }
  }

  return (
    <Tabs defaultValue={selectedUnit} onValueChange={handleUnitChange}>
      <div className="flex w-full flex-col mt-4 sm:mt-0">
        <div className="flex flex-col md:flex-row justify-between w-full px-4 md:gap-8 md:pl-8">
          <TabsList className="mb-4 w-auto">
            {unitsData?.map((unit) => (
              <TabsTrigger key={unit.id} value={unit.id} className="w-full">
                {unit.description}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* <div className="w-36 sm:w-44 mb-4 md:mr-6 md:hidden">
            <Select value={selectedUnit} onValueChange={handleUnitChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitsData?.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <input
            type="month"
            className="w-36 sm:w-44 mb-4 md:mr-6  px-2  h-9  rounded-lg bg-muted  text-foreground"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
          />
        </div>
        <>
          <TabsContent value={selectedUnit}>
            <MenuData data={data} unit={selectedUnit} userId={userId} />
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}
