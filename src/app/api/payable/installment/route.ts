import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";
const prisma = new PrismaClient();

const createPayableSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  totalValue: z.string().min(1, "O valor é obrigatório"),
  numberOfInstallments: z.number().min(1, "O número de parcelas é obrigatório"),
  dates: z.array(z.string().min(1, "A data é obrigatória")),
  category: z.string().min(1, "A categoria é obrigatória"),
  unit: z.string().min(1, "A unidade é obrigatória"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validatedData = createPayableSchema.parse(body);
  const {
    description,
    totalValue,
    category,
    numberOfInstallments,
    dates,
    unit,
  } = validatedData;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({});

  const data_unica = dates.length === 1;

  try {
    const newPayable = await prisma.payable.create({
      data: {
        description,
        unitId: Number(unit),
        categoryId: Number(category),
        numberOfInstallments,
        totalValue: totalValue,
        userId: session.user.id,
        uniqueDate: data_unica ? 1 : 0,
      },
    });

    const valuePerInstallment = Number(totalValue) / numberOfInstallments;

    if (data_unica) {
      let currentDate = new Date(dates[0]);
      for (let i = 0; i < numberOfInstallments; i++) {
        const newInstallment = await prisma.installment.create({
          data: {
            installmentNumber: `${i + 1}/${numberOfInstallments}`,
            value: valuePerInstallment,
            date: currentDate,
            payableId: newPayable.id,
            status: "A",
            description,
            userId: session.user.id,
            unitId: Number(unit),
            categoryId: Number(category),
          },
        });
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else {
      for (let i = 0; i < dates.length; i++) {
        const newInstallment = await prisma.installment.create({
          data: {
            installmentNumber: `${i + 1}/${numberOfInstallments}`,
            value: valuePerInstallment,
            date: new Date(dates[i]),
            payableId: newPayable.id,
            status: "A",
            description,
            userId: session.user.id,
            unitId: Number(unit),
            categoryId: Number(category),
          },
        });
      }
    }

    return NextResponse.json({ newPayable });
  } catch (error) {
    console.error("Erro ao salvar conta a pagar:", error);
    return NextResponse.json(
      { error: "Erro ao salvar conta a pagar" },
      { status: 500 }
    );
  }
}
export async function GET() {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({});
  const parcelas_a_pagar = await prisma.installment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [{ status: "asc" }, { date: "asc" }],
    include: {
      unit: true,
      category: true,
      moviment: true,
    },
  });

  return NextResponse.json(parcelas_a_pagar);
}
