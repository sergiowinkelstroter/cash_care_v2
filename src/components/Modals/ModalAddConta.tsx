import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Unit } from "@/types/Unit";
import { Category } from "@/types/Category";
import { Payable } from "@/types/Payable";
import { convertDateTimeToDate } from "./ModalAddMovement";

export const createPayableFormSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  totalValue: z.string().min(1, "O valor é obrigatório"),
  numberOfInstallments: z.string().min(1, "O número de parcelas é obrigatório"),
  date: z.string(),
  unit: z.string().min(1, "A unidade é obrigatória"),
  category: z.string().min(1, "A categoria é obrigatória"),
});

interface ModalAddContaProps {
  setOpen: (open: boolean) => void;
  conta?: Payable;
}

export const ModalAddConta = ({ conta, setOpen }: ModalAddContaProps) => {
  const dates = conta?.Installment.map((mod) =>
    convertDateTimeToDate(mod.date)
  );
  dates?.sort(function (a, b) {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm<z.infer<typeof createPayableFormSchema>>({
    resolver: zodResolver(createPayableFormSchema),
    defaultValues: {
      description: conta?.description,
      totalValue: conta?.totalValue,
      numberOfInstallments: conta?.numberOfInstallments.toString(),
      date: convertDateTimeToDate(conta?.Installment[0].date),
      unit: String(conta?.unitId),
      category: String(conta?.categoryId),
    },
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [multiplasData, setMultiplasData] = useState(false);
  const [dueDates, setDueDates] = useState<string[]>(dates || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { mutateAsync: createNewPayable, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof createPayableFormSchema>) => {
      if (
        multiplasData &&
        dueDates.length !== parseInt(values.numberOfInstallments)
      ) {
        toast({
          title: "Erro",
          description: "Informe todas as datas para as parcelas.",
          variant: "destructive",
        });
        return;
      }

      const installmentDates = multiplasData ? dueDates : [values.date];

      await api.post("/payable", {
        id: conta?.id,
        description: values.description,
        totalValue: values.totalValue,
        numberOfInstallments: Number(values.numberOfInstallments),
        dates: installmentDates,
        category: values.category,
        unit: values.unit,
        uniqueDate: multiplasData ? 0 : 1,
      });
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries("payable");
      queryClient.invalidateQueries("payables");
    },
  });

  async function handleNewPayable(
    payable: z.infer<typeof createPayableFormSchema>
  ) {
    try {
      await createNewPayable(payable);
      setOpen(false);
      reset();
      toast({
        title: "Conta a pagar adicionada",
        description: "Conta a pagar adicionada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar conta a pagar",
        variant: "destructive",
      });
    }
  }

  const { data: units }: { data: Unit[] | undefined } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/unit?situacao=A");
      return response.data;
    },
  });

  const numberOfInstallments = parseInt(getValues("numberOfInstallments"));
  useEffect(() => {
    if (!isNaN(numberOfInstallments)) {
      handleNumberOfInstallmentsChange(numberOfInstallments);
    }
  }, [numberOfInstallments]);

  useEffect(() => {
    if (conta?.unitId) {
      api.get(`/unit/categories?id=${conta?.unitId}`).then((response) => {
        setCategories(response.data);
      });
    }
  }, [conta]);

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

  useEffect(() => {
    if (conta?.uniqueDate === 0) {
      setMultiplasData(true);
    }
  }, [conta]);

  const handleNumberOfInstallmentsChange = (
    newNumberOfInstallments: number
  ) => {
    if (newNumberOfInstallments < dueDates.length) {
      setDueDates(dueDates.slice(0, newNumberOfInstallments));
    } else if (newNumberOfInstallments > dueDates.length) {
      const newDueDates = [...dueDates];
      for (let i = dueDates.length; i < newNumberOfInstallments; i++) {
        newDueDates.push("");
      }
      setDueDates(newDueDates);
    }
  };

  return (
    <DialogContent className="w-[320px] sm:w-full  sm:mt-0">
      <DialogHeader>
        <DialogTitle>
          {conta ? "Editar conta a pagar" : "Adicionar conta a pagar"}
        </DialogTitle>
        <DialogDescription className="hidden sm:block">
          {conta
            ? "Cuidado! Ao editar uma conta todas as parcelas anteriores serão excluidas."
            : "Adicione uma nova conta a pagar"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleNewPayable)}>
        <div className="grid gap-1 grid-cols-2 sm:gap-4  py-4">
          <div className="col-span-2">
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
              id="totalValue"
              type="text"
              placeholder="R$ 0,00"
              required
              {...register("totalValue")}
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
                    <SelectValue
                      placeholder="Selecione..."
                      defaultValue={value}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {units?.map((unit) => (
                      <SelectItem key={unit.id} value={String(unit.id)}>
                        {unit.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>N° de Parcelas</Label>
            <Input
              id="numberOfInstallments"
              type="number"
              required
              {...register("numberOfInstallments")}
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
                    <SelectValue
                      placeholder="Selecione..."
                      defaultValue={value}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="0">Carregando...</SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.description}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <RadioGroup
            defaultValue={multiplasData ? "true" : "false"}
            onValueChange={(value) => setMultiplasData(value === "true")}
            className="flex items-center justify-center gap-8 col-span-2 "
          >
            <div className="flex items-center  my-4 space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">Data única</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">Múltiplas datas</Label>
            </div>
          </RadioGroup>
          {multiplasData && !isNaN(numberOfInstallments) ? (
            [...Array(parseInt(getValues("numberOfInstallments")))].map(
              (_, index) => (
                <div key={index}>
                  <Label htmlFor={`date${index}`}>Data {index + 1}</Label>
                  <input
                    className="block h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id={`date${index}`}
                    type="date"
                    placeholder="01/01/2020"
                    required
                    defaultValue={dueDates[index]}
                    onChange={(e) => {
                      const newDueDates = [...dueDates];
                      newDueDates[index] = e.target.value;
                      setDueDates(newDueDates);
                    }}
                  />
                </div>
              )
            )
          ) : (
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                placeholder="01/01/2020"
                required
                className="block"
                {...register("date")}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => reset()}>
              Cancelar
            </Button>
          </DialogClose>
          {conta ? (
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
