import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { api_notify } from "@/lib/axios";
import { startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

const prisma = new PrismaClient();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export async function POST() {
  const timeZone = "America/Sao_Paulo"; // Defina o fuso horário correto
  let today = new Date();

  // Configurando a hora, os minutos, os segundos e os milissegundos para zero
  today.setUTCHours(0, 0, 0, 0);

  const startOfTodayLocal = startOfDay(today); // Início do dia no fuso horário local
  const endOfTodayLocal = endOfDay(today); // Fim do dia no fuso horário local

  const startOfTodayUTC = startOfTodayLocal.toISOString();
  const endOfTodayUTC = endOfTodayLocal.toISOString();

  const users = await prisma.user.findMany({
    where: {
      notification: "A",
      perfil: "classic",
    },
    include: {
      Installment: {
        where: {
          status: "A",
          date: {
            gte: startOfTodayUTC,
            lte: endOfTodayUTC,
          },
        },
        include: {
          unit: true,
        },
      },
    },
  });

  for (const user of users) {
    const installments = user.Installment;

    let message = `🌞 Bom dia, ${user.name}! 🌞\n\n`;

    if (installments.length > 0) {
      message += `📅 Hoje você tem a${
        installments.length === 1 ? "" : "s"
      } seguinte${installments.length === 1 ? "" : "s"} conta${
        installments.length === 1 ? "" : "s"
      } para pagar:\n\n`;

      installments.forEach((installment) => {
        let today_new = new Date();
        const formattedDate = formatInTimeZone(
          today_new, // Usando today em vez da data da parcela
          timeZone,
          "dd/MM",
          { locale: ptBR }
        );
        const formattedValue = formatCurrency(Number(installment.value));
        message += `🔸 ${installment.description} (Parcela: ${installment.installmentNumber})\n🗓️ Data de Vencimento: ${formattedDate}\n🏢 Unidade: ${installment.unit.description}\n💰 Valor: ${formattedValue}\n\n`;
      });
    } else {
      message += "🎉 Parabéns, você não tem contas a pagar hoje! 🎉";
    }

    const number = `55${user.fone.replace(/[^0-9]/g, "")}`;
    await api_notify.post("/teste", {
      number: number,
      textMessage: {
        text: message,
      },
    });
  }

  return NextResponse.json({
    status: 200,
  });
}
