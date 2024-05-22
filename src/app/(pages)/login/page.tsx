"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IUser {
  email: string;
  password: string;
}

export default function Login() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const navigate = useRouter();
  const [data, setData] = useState<IUser>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const res = await signIn<"credentials">("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      toast({
        description: res.error,
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    } else {
      navigate.push("/menu");
    }

    setData({
      email: "",
      password: "",
    });
    setIsLoading(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  if (session) {
    navigate.push("/painel");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center ">
        <h1 className=" text-white text-xl md:text-3xl font-bold mb-4">
          Cash Care
        </h1>
        <Card className="mx-auto grid w-[350px] md:w-[450px] gap-6">
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl">Autenticação</CardTitle>
              <CardDescription>
                Digite seu e-mail e senha abaixo para fazer login em sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={data.email}
                  name="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  autoComplete="email"
                  disabled={isLoading}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  name="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="w-full flex gap-2">
                <Button asChild className="w-full" variant={"secondary"}>
                  <Link href={"/"}>Voltar</Link>
                </Button>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Carregando..." : "Entrar"}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Não possui uma conta?{" "}
                <Link href="/register" className="underline">
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
