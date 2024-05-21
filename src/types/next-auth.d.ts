import nextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number | undefined;
      email: string | undefined;
      name: string | undefined;
      perfil: string | undefined;
      situacao: string | undefined;
      createdAt: Date | undefined;
    };
  }

  interface User {
    id: number | undefined;
    email: string | undefined;
    name: string | undefined;
    perfil: string | undefined;
    situacao: string | undefined;
    createdAt: Date | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number | undefined;
    email: string | undefined;
    name: string | undefined;
    perfil: string | undefined;
    situacao: string | undefined;
    createdAt: Date | undefined;
  }
}
