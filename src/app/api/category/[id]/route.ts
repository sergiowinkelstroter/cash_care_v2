import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();
const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return handleInvalidSession();
  }

  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  await prisma.categoryToUnit.deleteMany({
    where: {
      categoryId: Number(id),
      userId: session.user.id,
    },
  });

  await prisma.category.delete({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  await prisma.movement.deleteMany({
    where: {
      categoryId: Number(id),
    },
  });

  await prisma.installment.deleteMany({
    where: {
      categoryId: Number(id),
    },
  });

  await prisma.payable.deleteMany({
    where: {
      categoryId: Number(id),
    },
  });

  return NextResponse.json({ status: 200 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return handleInvalidSession();
  }

  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  const category = await prisma.category.findMany({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  return NextResponse.json(category[0], { status: 200 });
}
