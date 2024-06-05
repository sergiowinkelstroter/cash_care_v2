"use client";
import { BackupList } from "@/components/BackupsList";
import { Loading } from "@/components/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Backup } from "@/types/Backup";

interface IUser {
  name: string;
  email: string;
  password: string;
  perfil: string;
}

export function PageAdmin({ session }: { session: Session | null }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
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

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  const { mutateAsync: createBackup } = useMutation({
    mutationKey: ["backups"],
    mutationFn: async () => {
      const response = await api.post("/backups");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("backups");
    },
  });

  const { data: users } = useQuery("users", async () => {
    const response = await api.get("/users");
    return response.data;
  });

  const { data: backups } = useQuery("backups", async () => {
    const response = await api.get("/backups");
    return response.data;
  });

  let b: Backup[] = [];

  async function handleCreateBackup() {
    try {
      await createBackup();
      toast({
        description: "Backup criado com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao criar o backup",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  }

  if (users === undefined || backups === undefined) {
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
          <TabsTrigger value="3">Backups</TabsTrigger>
        </TabsList>

        <>
          <div className="mt-4  fixed top-3 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-44 ml-5 text-center flex flex-col items-center justify-center"
              >
                <DropdownMenuLabel className="text-xs">
                  {session?.user?.name?.toUpperCase()}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs">
                  {session?.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSignOut()} asChild>
                  <Button variant={"destructive"} className="w-full">
                    Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <TabsContent value="3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col items-start">
                  <CardTitle>Backups</CardTitle>
                  <CardDescription>Backups criados</CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Criar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Criar backup</AlertDialogTitle>
                      <AlertDialogDescription>
                        Clique aqui para criar um backup.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          variant={"default"}
                          onClick={() => handleCreateBackup()}
                        >
                          Criar
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent>
                <BackupList data={b} />
              </CardContent>
            </Card>
          </TabsContent>
        </>
      </Tabs>
    </div>
  );
}
