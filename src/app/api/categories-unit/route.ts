import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();
const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");
  const session = await getCurrentUser();
  if (!session?.user?.id) return handleInvalidSession();

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.id,
      situacao: "A",
    },
    include: {
      units: {
        where: {
          unitId: Number(id),
        },
      },
    },
  });

  const formattedCategories = categories.map((category) => ({
    id: category.id,
    description: category.description,
    associated: category.units.length > 0,
  }));

  return NextResponse.json(formattedCategories);
}
