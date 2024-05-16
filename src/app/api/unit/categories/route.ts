import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");
  const session = await getCurrentUser();
  const userId = session?.user.id;
  if (userId === undefined) return NextResponse.json({ status: 500 });
  const body = await req.json();
  const { categories } = body;
  categories.forEach(async (categoryId: number) => {
    const c = await prisma.categoryToUnit.findMany({
      where: {
        unitId: Number(id),
        categoryId: Number(categoryId),
        userId,
      },
    });

    if (c.length > 0) {
      await prisma.categoryToUnit.deleteMany({
        where: {
          unitId: Number(id),
          categoryId: Number(categoryId),
          userId,
        },
      });
    } else {
      await prisma.categoryToUnit.create({
        data: {
          unitId: Number(id),
          categoryId: Number(categoryId),
          userId,
        },
      });
    }
  });

  return NextResponse.json({ status: 200 });
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const c = await prisma.categoryToUnit.findMany({
    where: {
      unitId: Number(id),
      userId: session.user.id,
    },
    include: {
      category: true,
    },
  });

  const formattedCategories = c.filter((c) => c.category.situacao === "A");

  const categories = formattedCategories.map((c) => {
    return c.category;
  });

  return NextResponse.json(categories, { status: 200 });
}
