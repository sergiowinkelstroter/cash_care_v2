import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }

  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  await prisma.categoryToUnit.deleteMany({
    where: {
      unitId: Number(id),
      userId: session.user.id,
    },
  });

  await prisma.unit.delete({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  await prisma.installment.deleteMany({
    where: {
      unitId: Number(id),
    },
  });

  await prisma.movement.deleteMany({
    where: {
      unitId: Number(id),
    },
  });

  await prisma.payable.deleteMany({
    where: {
      unitId: Number(id),
    },
  });

  return NextResponse.json({ status: 200 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }
  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });
  const body = await req.json();
  const { categoryId } = body;
  const assocUnitAndCategory = await prisma.categoryToUnit.create({
    data: {
      unitId: Number(id),
      categoryId: Number(categoryId),
      userId: session.user.id,
    },
  });

  return NextResponse.json(assocUnitAndCategory, { status: 200 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }
  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const unit = await prisma.unit.findMany({
    where: {
      userId: session.user.id,
      id: Number(id),
    },
  });

  return NextResponse.json(unit, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }
  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });
  const body = await request.json();
  const { description, situacao } = body;
  const unit = await prisma.unit.update({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
    data: {
      description,
      situacao,
    },
  });
  return NextResponse.json(unit, { status: 200 });
}
