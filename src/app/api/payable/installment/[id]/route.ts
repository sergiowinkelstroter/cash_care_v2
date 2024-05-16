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

  const existingInstallment = await prisma.installment.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      moviment: true,
    },
  });

  await prisma.installment.deleteMany({
    where: {
      id: Number(id),
    },
  });

  if (existingInstallment && existingInstallment.moviment) {
    await prisma.movement.delete({
      where: {
        id: existingInstallment.moviment.id,
      },
    });
  }

  return NextResponse.json({ status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }

  const id = params.id;
  const query = request.nextUrl.searchParams;
  const status = query.get("status");

  const body = await request.json();
  const { data, valor, paymentMethod } = body;

  const session = await getCurrentUser();
  if (!session?.user.id) {
    return NextResponse.json({ status: 500 });
  }

  try {
    let installment;

    if (status === "A") {
      installment = await prisma.installment.update({
        where: {
          id: Number(id),
        },
        data: {
          status: "P",
        },
      });

      const transaction = await prisma.movement.create({
        data: {
          description: `${installment.description} *${installment.installmentNumber}`,
          value: valor || installment.value,
          type: "saida",
          date: `${data}T00:00:00Z` || installment.date,
          userId: session.user.id,
          categoryId: installment.categoryId || undefined,
          unitId: installment.unitId,
          paymentMethod: paymentMethod,
        },
      });

      installment = await prisma.installment.update({
        where: {
          id: Number(id),
        },
        data: {
          movimentId: transaction.id,
        },
      });
    } else if (status === "P") {
      const existingInstallment = await prisma.installment.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          moviment: true,
        },
      });

      if (existingInstallment && existingInstallment.moviment) {
        await prisma.movement.delete({
          where: {
            id: existingInstallment.moviment.id,
          },
        });
      }

      installment = await prisma.installment.update({
        where: {
          id: Number(id),
        },
        data: {
          status: "A",
        },
      });
    } else {
      return NextResponse.json({ status: 400, message: "Status inválido" });
    }

    return NextResponse.json({ status: 200, data: installment });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    return NextResponse.json({
      status: 500,
      message: "Erro interno do servidor",
    });
  }
}
