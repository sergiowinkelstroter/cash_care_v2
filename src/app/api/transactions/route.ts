import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();
const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, description, value, unit, type, date, category, paymentMethod } =
    body;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  let newTransaction;

  if (id === undefined) {
    newTransaction = await prisma.movement.create({
      data: {
        description,
        value: value,
        unitId: Number(unit),
        type,
        date: `${date}T00:00:00Z`,
        userId: session.user.id,
        categoryId: Number(category),
        paymentMethod: paymentMethod,
      },
    });
  } else {
    newTransaction = await prisma.movement.update({
      where: {
        id: Number(id),
      },
      data: {
        description,
        value: value,
        unitId: Number(unit),
        type,
        date: `${date}T00:00:00Z`,
        userId: session.user.id,
        categoryId: Number(category),
        paymentMethod: paymentMethod,
      },
    });
  }

  return NextResponse.json(newTransaction);
}

export async function GET() {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();
  const transactions = await prisma.movement.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
      unit: true,
    },
  });
  return NextResponse.json(transactions);
}
