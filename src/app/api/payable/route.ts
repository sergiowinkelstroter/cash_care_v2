import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

const prisma = new PrismaClient();

const handleInvalidSession = () => NextResponse.json({ status: 500 });

const createPayableSchema = z.object({
  id: z.number().min(1, "A descrição é obrigatória").or(z.undefined()),
  description: z.string().min(1, "A descrição é obrigatória"),
  totalValue: z.string().min(1, "O valor é obrigatório"),
  numberOfInstallments: z.number().min(1, "O número de parcelas é obrigatório"),
  dates: z.array(z.string().min(1, "A data é obrigatória")),
  category: z.string().min(1, "A categoria é obrigatória"),
  unit: z.string().min(1, "A unidade é obrigatória"),
});

export async function GET() {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();
  try {
    const payables = await prisma.payable.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
        unit: true,
        Installment: true,
      },
    });
    return NextResponse.json(payables);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const search = request.nextUrl.searchParams;
  const id = search.get("id");
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    await prisma.installment.deleteMany({
      where: {
        payableId: Number(id),
        userId: session.user.id,
      },
    });

    await prisma.payable.delete({
      where: {
        id: Number(id),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar a solicitação." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();
  const body = await request.json();
  const validatedData = createPayableSchema.parse(body);
  const {
    id,
    description,
    totalValue,
    category,
    numberOfInstallments,
    dates,
    unit,
  } = validatedData;

  const data_unica = dates.length === 1;

  try {
    let newPayable;
    if (id) {
      newPayable = await prisma.payable.update({
        where: {
          id: Number(id),
          userId: session.user.id,
        },
        data: {
          description,
          totalValue: Number(totalValue),
          numberOfInstallments: Number(numberOfInstallments),
          unitId: Number(unit),
          categoryId: Number(category),
          uniqueDate: data_unica ? 1 : 0,
        },
      });

      await prisma.installment.deleteMany({
        where: {
          payableId: Number(id),
          userId: session.user.id,
        },
      });
    } else {
      newPayable = await prisma.payable.create({
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
    }

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
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
