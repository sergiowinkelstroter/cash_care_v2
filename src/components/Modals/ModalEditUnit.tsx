import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { useContext } from "react";
import { UnitContext } from "@/context/UnitContext";

const updateUnidadeFormSchema = z.object({
  description: z.string().min(1, "O nome é obrigatório"),
  situacao: z.string().min(1, "A situação é obrigatória"),
});

export const ModalEditUnit = ({
  id,
  description,
  situacao,
}: {
  id: string;
  description: string;
  situacao: string;
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof updateUnidadeFormSchema>>({
    resolver: zodResolver(updateUnidadeFormSchema),
    defaultValues: {
      description,
      situacao,
    },
  });
  const queryClient = useQueryClient();
  const { setOpenDrawer, setOpenEditUnit } = useContext(UnitContext);

  const { mutateAsync: updateUnidade, isLoading } = useMutation({
    mutationKey: ["unidades"],
    mutationFn: async (value: z.infer<typeof updateUnidadeFormSchema>) => {
      console.log("values: " + value);
      await api.put(`/unit/${id}`, {
        description: value.description,
        situacao: value.situacao,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
    },
  });

  const handleChange = async (
    value: z.infer<typeof updateUnidadeFormSchema>
  ) => {
    try {
      await updateUnidade(value);
      setOpenEditUnit(false);
      setOpenDrawer(false);
      reset();
      toast({
        description: "Unidade editada com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao editar a unidade",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  };
  return (
    <DialogContent className="w-[320px] sm:w-full  sm:mt-0">
      <form onSubmit={handleSubmit(handleChange)} className="">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-4">
            Editar unidade: <b>{description.toUpperCase()}</b>
          </DialogTitle>
        </DialogHeader>
        <div className="mb-2">
          <Label>Descricão</Label>
          <Input type="text" {...register("description")} required={true} />
        </div>
        <div>
          <Label>Situação</Label>
          <Controller
            control={control}
            name="situacao"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue defaultValue={situacao} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Ativa</SelectItem>
                  <SelectItem value="I">Inativa</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <DialogFooter className="mt-4 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            Editar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
