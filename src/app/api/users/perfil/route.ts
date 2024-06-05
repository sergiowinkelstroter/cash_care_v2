import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function GET() {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const perfil = {
    name: user?.name,
    email: user?.email,
    perfil: user?.perfil,
    fone: user?.fone,
    notification: user?.notification === "A" ? true : false,
  };

  return NextResponse.json(perfil, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  const body = await request.json();

  const { name, email, fone, notification } = body;

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
      email,
      fone,
      notification: notification === true ? "A" : "I",
    },
  });

  return NextResponse.json(user, { status: 200 });
}
