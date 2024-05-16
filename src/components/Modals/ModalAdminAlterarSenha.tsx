import { User } from "@/types/User";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "react-query";
import { api } from "@/lib/axios";
import { useToast } from "../ui/use-toast";

const alterarSenhaSchema = z.object({
  password: z.string().min(1, "O campo é obrigatório"),
});

export const ModalAdminAlterarSenha = ({ user }: { user: User }) => {
  const { toast } = useToast();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof alterarSenhaSchema>>({
    resolver: zodResolver(alterarSenhaSchema),
  });
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: alterarSenha } = useMutation({
    mutationFn: async (data: z.infer<typeof alterarSenhaSchema>) => {
      await api.post(`/users/perfil/update-password`, {
        id: user.id,
        password: data.password,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleAlterarSenha(data: z.infer<typeof alterarSenhaSchema>) {
    try {
      console.log(data.password);
      await alterarSenha(data);
      reset();
      toast({
        title: "Sucesso",
        description: "Senha foi alterada com sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(handleAlterarSenha)}>
        <DialogTitle>Alterar senha do {user.name}</DialogTitle>
        <div className="flex flex-col gap-2 my-4">
          <Label>Nova senha</Label>
          <div className="flex items-center gap-2 ">
            <Input
              {...register("password")}
              type={visible ? "text" : "password"}
              className="w-full"
            />
            {visible ? (
              <span
                onClick={() => setVisible(false)}
                className="cursor-pointer"
              >
                <Eye />
              </span>
            ) : (
              <span onClick={() => setVisible(true)} className="cursor-pointer">
                <EyeOff />
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Alterar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
