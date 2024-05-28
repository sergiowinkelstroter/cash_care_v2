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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  fone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/),
  password: z.string().min(1, "A senha é obrigatória"),
  confirmPassword: z.string().min(1, "A confirmação da senha é obrigatória"),
});

export default function Register() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });
  const { toast } = useToast();
  const route = useRouter();

  const { mutateAsync: createUser, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const res = await api.post("/users", {
        name: values.name,
        email: values.email,
        password: values.password,
        perfil: "test",
        fone: values.fone,
      });
      return res.data;
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    if (password !== confirmPassword) {
      toast({
        description: "As senhas devem ser iguais",
        title: "Erro!",
        variant: "destructive",
      });
      return;
    }
    try {
      await createUser(data);
      reset();
      route.push("/login");
    } catch (error: AxiosError | any) {
      console.log(error);
      toast({
        description: error?.response?.data?.error,
        title: "Erro!",
        variant: "destructive",
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black py-10 md:py-0">
      <h1 className=" text-white text-xl md:text-3xl font-bold mb-4">
        Cash Care
      </h1>
      <div className="flex flex-col items-center justify-center ">
        <Card className="mx-auto grid w-[350px] md:w-[650px]">
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <CardDescription>
              Cadastre-se agora e comece seu teste gratuito de 7 dias!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Nome</Label>
                <Input type="text" required {...register("name")} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" required {...register("email")} />
              </div>
              <div>
                <Label>
                  Telefone{" "}
                  <span className="text-xs text-gray-500">
                    Ex:(11) 23456-7890
                  </span>
                </Label>
                <Input
                  type="text"
                  required
                  {...register("fone")}
                  // placeholder="(XX) 9XXXX-XXXX"
                />
                {/* <span>{errors?.fone?.message}</span> */}
              </div>
              <div>
                <Label>Senha</Label>
                <Input type="password" required {...register("password")} />
              </div>
              <div>
                <Label>Confirmar Senha</Label>
                <Input
                  type="password"
                  required
                  {...register("confirmPassword")}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="w-full flex gap-2">
                <Button asChild className="w-full" variant={"secondary"}>
                  <Link href={"/"}>Voltar</Link>
                </Button>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Carregando..." : "Cadastrar"}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Já possui uma conta?{" "}
                <Link href="/login" className="underline">
                  Clique aqui
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
