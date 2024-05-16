"use client";
import { Button } from "@/components/ui/button";
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
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/Category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const createCategoriaFormSchema = z.object({
  description: z.string().min(1, "O nome é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória"),
  situacao: z.string().min(1, "A situação é obrigatória"),
});

interface ModalAddCategoryProps {
  setOpen: (value: boolean) => void;
  category?: Category;
}

export const ModalAddCategory = ({
  setOpen,
  category,
}: ModalAddCategoryProps) => {
  const { toast } = useToast();
  const {
    register,
    formState,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<z.infer<typeof createCategoriaFormSchema>>({
    resolver: zodResolver(createCategoriaFormSchema),
    defaultValues: {
      description: category?.description,
      color: category?.color,
      situacao: category?.situacao,
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: createCategoria, isLoading } = useMutation({
    mutationKey: ["categorias"],
    mutationFn: async (value: z.infer<typeof createCategoriaFormSchema>) => {
      await api.post("/category", {
        id: category?.id,
        description: value.description,
        color: value.color,
        situacao: value.situacao,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  async function handleChange(
    value: z.infer<typeof createCategoriaFormSchema>
  ) {
    console.log(value);
    try {
      await createCategoria(value);
      setOpen(false);
      reset();
      toast({
        description: "Categoria criada com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao criar a Categoria",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  }
  return (
    <DialogContent className="w-[320px] sm:w-full  sm:mt-0">
      <DialogHeader>
        <DialogTitle className="text-center text-xl mb-4">
          {category ? "Editar categoria" : "Adicionar categoria"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleChange)} className="">
        <div>
          <Label>Descricão</Label>
          <Input
            id="description"
            type="text"
            {...register("description")}
            defaultValue={category?.description}
          />
        </div>
        <div>
          <Label>Situação</Label>
          <Controller
            control={control}
            name="situacao"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue defaultValue={category?.situacao} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Ativa</SelectItem>
                  <SelectItem value="I">Inativa</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>Cor</Label>
          <Input
            id="color"
            type="color"
            {...register("color")}
            defaultValue={category?.color}
          />
        </div>
        <DialogFooter className="mt-4 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          {category ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando.." : "Editar"}
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando.." : "Adicionar"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
