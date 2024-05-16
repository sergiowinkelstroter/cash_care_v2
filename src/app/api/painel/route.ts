import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const unit = searchParams.get("unit");
  const month = searchParams.get("month");

  if (unit === null || month === null) {
    return NextResponse.json({ status: 500 });
  }

  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  const year = parseInt(month.substring(0, 4));
  const monthNumber = parseInt(month.substring(5, 7)) - 1;
  const startOfMonth = new Date(year, monthNumber, 1);
  const endOfMonth = new Date(year, monthNumber + 1, 0);

  let transactions;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Unit: true,
    },
  });

  transactions = await prisma.movement.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      userId: session.user.id,
      unitId: Number(unit) || user?.Unit[0].id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: {
      category: true,
    },
  });

  let entradas = 0;
  let saidas = 0;
  let total = 0;
  let valor_contas_a_pagar = 0;

  const parcelas_a_pagar = await prisma.installment.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: "A",
      unitId: Number(unit) || user?.Unit[0].id,
    },
    orderBy: {
      date: "asc",
    },
  });

  const units = await prisma.unit.findMany({
    where: {
      userId: session.user.id,
    },
  });

  transactions.forEach((transaction) => {
    if (transaction.type === "entrada") {
      entradas += Number(transaction.value.toFixed(2));
    } else if (transaction.type === "saida") {
      saidas += Number(transaction.value.toFixed(2));
    }
  });

  total = entradas - saidas;

  parcelas_a_pagar &&
    parcelas_a_pagar.forEach((installment) => {
      if (installment.status === "A") {
        valor_contas_a_pagar += Number(installment.value.toFixed(2));
      }
    });

  const data = [];
  let currentDate = new Date(startOfMonth);
  currentDate.setDate(6);
  while (currentDate <= endOfMonth) {
    let intervalTotal = 0;
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getDate() <= currentDate.getDate() &&
        transactionDate.getMonth() === currentDate.getMonth()
      ) {
        if (transaction.type === "entrada") {
          intervalTotal += Number(transaction.value.toFixed(2));
        } else if (transaction.type === "saida") {
          intervalTotal -= Number(transaction.value.toFixed(2));
        }
      }
    });
    data.push({
      name: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
      total: intervalTotal,
    });
    currentDate.setDate(currentDate.getDate() + 8);
  }

  return NextResponse.json({
    entradas,
    saidas,
    parcelas_a_pagar,
    valor_contas_a_pagar,
    total,
    transactions,
    monthtoday: month,
    units,
    variations: data,
  });
}
