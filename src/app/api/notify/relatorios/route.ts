import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { api_notify } from "@/lib/axios";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

const generateReportLinks = (
  userId: number,
  previousMonth: string,
  unit: number
) => {
  const movimentacoesLink = `https://cashcare.cloud/pdf/movimentacoes/${userId}/${previousMonth}/${unit}/relatorio-movimentacoes`;
  const contasAPagarLink = `https://cashcare.cloud/pdf/contas-a-pagar/${userId}/${previousMonth}/${unit}/relatorio-contas-a-pagar`;
  return { movimentacoesLink, contasAPagarLink };
};

export async function POST() {
  const users = await prisma.user.findMany({
    where: {
      notification: "A",
      perfil: "classic",
    },
    include: {
      Unit: true,
    },
  });

  const today = new Date();
  const previousMonthDate = subMonths(today, 1);
  const previousMonth = format(previousMonthDate, "yyyy-MM");
  const previousMonthName = format(previousMonthDate, "MMMM", { locale: ptBR });

  for (const user of users) {
    let message = `🌞 Bom dia, ${
      user.name
    }!\n\n📅 Segue abaixo os links dos relatórios de Movimentações e Contas a Pagar do mês de ${previousMonthName.toUpperCase()}:\n\n`;

    user.Unit.forEach((unit) => {
      const { movimentacoesLink, contasAPagarLink } = generateReportLinks(
        user.id,
        previousMonth,
        unit.id
      );
      message += `🔹 Unidade: ${unit.description}\n🔗 Movimentações:${movimentacoesLink}\n🔗 Contas a Pagar:${contasAPagarLink}\n\n`;
    });

    const number = `55${user.fone.replace(/[^0-9]/g, "")}`;
    await api_notify.post(`/${process.env.INSTANCE}`, {
      number: number,
      textMessage: {
        text: message,
      },
    });
  }

  return NextResponse.json({ status: 200, users, previousMonth });
}
