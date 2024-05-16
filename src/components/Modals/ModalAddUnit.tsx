import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

const createUnidadeFormSchema = z.object({
  description: z.string().min(1, "O nome é obrigatório"),
});

export const ModalAddUnit = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createUnidadeFormSchema>>({
    resolver: zodResolver(createUnidadeFormSchema),
  });
  const queryClient = useQueryClient();

  const { mutateAsync: createUnidade, isLoading } = useMutation({
    mutationKey: ["unidades"],
    mutationFn: async (value: z.infer<typeof createUnidadeFormSchema>) => {
      await api.post("/unit", {
        name: value.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
    },
  });

  async function handleChange(value: z.infer<typeof createUnidadeFormSchema>) {
    try {
      await createUnidade(value);
      toast({
        description: "Unidade criada com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao criar a unidade",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  }
  return (
    <AlertDialogContent className="w-[320px] sm:w-full  sm:mt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleChange)} className="">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl mb-4">
              Adicione uma Unidade
            </AlertDialogTitle>
          </AlertDialogHeader>
          <FormField
            control={form.control}
            defaultValue=""
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Descrição</FormLabel>
                <FormControl>
                  <Input id="description" type="text" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Adicionar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  );
};
