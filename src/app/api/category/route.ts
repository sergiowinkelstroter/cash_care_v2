import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const situacao = search.get("situacao");
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  if (situacao === "A") {
    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
        situacao: "A",
      },
    });
    return NextResponse.json(categories);
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest, response: NextResponse) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const body = await request.json();

  const { id, description, color, situacao } = body;

  let category;

  if (id === undefined) {
    category = await prisma.category.create({
      data: {
        description: description,
        color: color,
        situacao: situacao,
        userId: session.user.id,
      },
    });
  } else {
    category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
        color: color,
        situacao: situacao,
        userId: session.user.id,
      },
    });
  }

  return NextResponse.json(category, { status: 200 });
}
