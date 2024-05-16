import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

export async function GET() {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const perfil = {
    name: user?.name,
    email: user?.email,
    perfil: user?.perfil,
  };

  return NextResponse.json(perfil, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const body = await request.json();

  const { name, email } = body;

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
      email,
    },
  });

  return NextResponse.json(user, { status: 200 });
}
