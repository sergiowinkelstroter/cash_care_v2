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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { Loading } from "@/components/Loading";
import { ModalAlterarSenha } from "@/components/Modals/ModalAlterarSenha";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const perfilSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  perfil: z.string().optional(),
});

export const Perfil = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const response = await api.get("/users/perfil");
      return response.data;
    },
  });

  const { formState, register, handleSubmit, setValue } = useForm<
    z.infer<typeof perfilSchema>
  >({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      perfil: data?.perfil ?? "",
    },
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (data: z.infer<typeof perfilSchema>) => {
      const response = await api.patch("/users/perfil", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["perfil"]);
    },
  });

  async function handleAlterarPerfil(data: z.infer<typeof perfilSchema>) {
    try {
      await updateProfile(data);
      toast({
        title: "Alterado com sucesso",
        description: "Seu perfil foi alterado com sucesso",
        color: "green",
      });
      queryClient.invalidateQueries(["perfil"]);
    } catch (error) {
      toast({
        title: "Erro ao alterar perfil",
        description: "Erro ao alterar seu perfil",
        color: "red",
      });
    }
  }

  useEffect(() => {
    if (!isLoading) {
      setValue("name", data?.name ?? "");
      setValue("email", data?.email ?? "");
      setValue("perfil", data?.perfil ?? "");
    }
  }, [isLoading, data, setValue]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <Card className="mt-4 relative">
      <Dialog>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Perfil</CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(handleAlterarPerfil)}>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                placeholder="Nome"
                defaultValue={data?.name}
                {...register("name")}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                placeholder="Email"
                defaultValue={data?.email}
                {...register("email")}
              />
            </div>
            <div>
              <Label>Perfil</Label>
              <Input
                placeholder="Perfil"
                defaultValue={data?.perfil}
                {...register("perfil")}
                disabled
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant="default">Alterar senha</Button>
            </DialogTrigger>

            <Button type="submit" disabled={formState.isSubmitting}>
              Salvar alterações
            </Button>
          </CardFooter>
        </form>
        <ModalAlterarSenha />
      </Dialog>
    </Card>
  );
};
