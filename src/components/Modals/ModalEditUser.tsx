import { User } from "@/types/User";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "react-query";
import { useContext } from "react";
import { AdminContext } from "@/context/AdminContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { api } from "@/lib/axios";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

const editUserSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  perfil: z.string().optional(),
});

export function ModalEditUser({
  user,
  setOpen,
}: {
  user: User;
  setOpen: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset, control } = useForm<
    z.infer<typeof editUserSchema>
  >({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      perfil: user.perfil,
    },
  });
  const queryClient = useQueryClient();
  const { setOpenUserDrawer } = useContext(AdminContext);
  const { toast } = useToast();
  const { mutateAsync: updateUser, isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof editUserSchema>) => {
      await api.patch("/users", {
        id: user.id,
        name: data.name,
        email: data.email,
        perfil: data.perfil,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleUpdate(data: z.infer<typeof editUserSchema>) {
    try {
      await updateUser(data);
      setOpen(false);
      setOpenUserDrawer(false);
      reset();
      toast({
        title: "Sucesso",
        description: "Usuário editado com sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao editar usuário",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar usuário {user.name}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="flex flex-col gap-3 mt-4"
      >
        <div className="flex flex-col gap-2">
          <Label>Nome</Label>
          <Input {...register("name")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input {...register("email")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Perfil</Label>
          <Controller
            control={control}
            name="perfil"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Selecione"
                    defaultValue={user.perfil}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <DialogFooter>
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
}
