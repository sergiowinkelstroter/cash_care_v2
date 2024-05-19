"use client";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "../ui/use-toast";
import { api } from "@/lib/axios";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

const formPasswordSchema = z.object({
  oldPassword: z.string().min(1, "O campo é obrigatório"),
  newPassword: z.string().min(1, "O campo é obrigatório"),
});

export const ModalAlterarSenha = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formPasswordSchema>>({
    resolver: zodResolver(formPasswordSchema),
  });
  const [visibleOldPassword, setVisibleOldPassword] = useState(false);
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);

  async function handleAlterarSenha(data: {
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await api.patch("/users/perfil/update-password", data);
      setOpen(false);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
        color: "green",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Erro ao alterar sua senha",
        color: "red",
      });
    }
  }

  return (
    <DialogContent className="w-[320px] sm:w-full  sm:mt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAlterarSenha)} className="">
          <DialogHeader>
            <DialogTitle className="text-center text-xl mb-4">
              Alterar Senha
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              defaultValue=""
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="oldpassword">Senha atual</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        id="oldpassword"
                        type={visibleOldPassword ? "text" : "password"}
                        required
                        {...field}
                      ></Input>
                    </FormControl>
                    {visibleOldPassword ? (
                      <span
                        className="hover:cursor-pointer"
                        onClick={() =>
                          setVisibleOldPassword(!visibleOldPassword)
                        }
                      >
                        <Eye />
                      </span>
                    ) : (
                      <span
                        className="hover:cursor-pointer"
                        onClick={() =>
                          setVisibleOldPassword(!visibleOldPassword)
                        }
                      >
                        <EyeOff />
                      </span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        id="newPassword"
                        type={visibleNewPassword ? "text" : "password"}
                        required
                        {...field}
                      />
                    </FormControl>
                    {visibleNewPassword ? (
                      <span
                        className="hover:cursor-pointer"
                        onClick={() =>
                          setVisibleNewPassword(!visibleNewPassword)
                        }
                      >
                        <Eye />
                      </span>
                    ) : (
                      <span
                        className="hover:cursor-pointer"
                        onClick={() =>
                          setVisibleNewPassword(!visibleNewPassword)
                        }
                      >
                        <EyeOff />
                      </span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Alterar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
