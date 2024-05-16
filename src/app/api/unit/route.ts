import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });
  const search = request.nextUrl.searchParams;
  const situacao = search.get("situacao");

  if (situacao === "A") {
    const units = await prisma.unit.findMany({
      where: {
        userId: session.user.id,
        situacao: "A",
      },
    });
    return NextResponse.json(units);
  }

  const units = await prisma.unit.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(units);
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });
  const body = await request.json();
  const { name } = body;
  const unit = await prisma.unit.create({
    data: {
      description: name,
      userId: session.user.id,
    },
  });
  return NextResponse.json(unit);
}
