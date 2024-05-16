import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db as any),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Dados de autenticação necessários");
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuário não registrado no sistema");
        }

        const matchPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!matchPassword) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 259200, // 3 days
  },
  callbacks: {
    async jwt({ token, user }) {
      let idUser: number | undefined;
      let perfil: string | undefined;
      let situacao: string | undefined;

      if (user) {
        const newUser = await db.user.findUnique({
          where: {
            email: user.email,
          },
        });

        idUser = newUser?.id;
        perfil = newUser?.perfil;
        situacao = newUser?.situacao;

        token.userId = idUser;
        token.perfil = perfil;
        token.situacao = situacao;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.userId;
      session.user.perfil = token.perfil;
      session.user.situacao = token.situacao;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
