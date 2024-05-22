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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";

const perfilSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  fone: z.string().optional(),
  perfil: z.string().optional(),
  notification: z.boolean().optional(),
});

export const Perfil = () => {
  const { toast } = useToast();
  const navigate = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

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
      fone: data?.fone ?? "",
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
      setValue("fone", data?.fone ?? "");
    }
  }, [isLoading, data, setValue]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center mt-16">
        <Loading />
      </div>
    );
  }

  const handleContact = () => {
    const phoneNumber = "5599991529825";
    const message = "Olá, gostaria de renovar minha assinatura do Cash Care.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="mt-4 relative">
      <Dialog open={open} onOpenChange={setOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Perfil</CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit(handleAlterarPerfil)}>
          <CardContent className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              <Label>Telefone</Label>
              <Input
                placeholder="Telefone"
                defaultValue={data?.fone}
                {...register("fone")}
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

          <CardFooter className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center w-full">
            <div className="flex justify-start items-center gap-2">
              <Input
                type="checkbox"
                className="h-5 w-5"
                defaultChecked={data?.notification}
                {...register("notification")}
              />
              <span className="">Receber notificações</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
              {session?.user.perfil === "test" ? (
                <Button variant="default" onClick={handleContact} className="">
                  <MessageCircle className="mr-2" size={16} />
                  Ativar assinatura
                </Button>
              ) : (
                <Button asChild>
                  <Link href={"/painel-pagamento"}>Painel de Pagamento</Link>
                </Button>
              )}
              <DialogTrigger asChild>
                <Button variant="default">Alterar senha</Button>
              </DialogTrigger>

              <Button type="submit" disabled={formState.isSubmitting}>
                Salvar alterações
              </Button>
            </div>
          </CardFooter>
        </form>
        <ModalAlterarSenha setOpen={setOpen} />
      </Dialog>
    </Card>
  );
};
