"use client";
import { columnsUser } from "@/components/Columns/ColumnsUser";
import { DataTable } from "@/components/DataTable";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UsersList } from "@/components/UsersList";
import { api } from "@/lib/axios";
import { TabsList } from "@radix-ui/react-tabs";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

interface IUser {
  name: string;
  email: string;
  password: string;
  perfil: string;
}

export default function Admin() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [data, setData] = useState<IUser>({
    email: "",
    password: "",
    perfil: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const res = await api.post("/users", {
      name: data.name,
      email: data.email,
      password: data.password,
      perfil: data.perfil,
    });

    if (res?.status === 201) {
      toast({
        description: "Usuario criado com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } else {
      toast({
        description: "Erro ao criar o usuario",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }

    setData({
      email: "",
      password: "",
      perfil: "",
      name: "",
    });
    setIsLoading(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  if (!session) {
    redirect("/");
  }

  function handleSignOut() {
    signOut({
      redirect: false,
    }).then(() => {
      redirect("/login");
    });
  }

  const { data: users } = useQuery("users", async () => {
    const response = await api.get("/users");
    return response.data;
  });

  if (users === undefined) {
    return (
      <div className="flex min-h-screen justify-center mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center mt-16 mx-8 md:mx-0">
      <Tabs defaultValue="1" className="w-full flex flex-col  max-w-[800px]">
        <TabsList>
          <TabsTrigger value="1">Lista</TabsTrigger>
          <TabsTrigger value="2">Formulário</TabsTrigger>
        </TabsList>

        <>
          <div className="mt-4  fixed top-3 right-4">
            <Button variant={"destructive"} onClick={() => handleSignOut()}>
              Sair
            </Button>
          </div>
          <TabsContent value="1">
            <Card>
              <CardHeader>
                <CardTitle>Lista de usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersList data={users} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Criar novo usuario</CardTitle>
              </CardHeader>
              <form onSubmit={onSubmit} className="">
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={data.name}
                      name="name"
                      autoCorrect="off"
                      autoCapitalize="none"
                      autoComplete="name"
                      disabled={isLoading}
                      onChange={handleChange}
                    />
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="perfil">Perfil</Label>
                    <Select
                      onValueChange={(e) => setData({ ...data, perfil: e })}
                      value={data.perfil}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Carregando..." : "Criar"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </>
      </Tabs>
    </div>
  );
}
