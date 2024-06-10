const express = require("express");
const next = require("next");
const path = require("path");
const { generateReport, genPDF } = require("./utils/pdf");
const { query } = require("./db");
const { formatDateString } = require("./utils/formattedString");
const dotenv = require("dotenv");
dotenv.config();
const cron = require("node-cron");
const fetch = require("node-fetch");

// Define a função que será executada no agendamento
const executeTask = async () => {
  try {
    // Faz a chamada para sua rota
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/notify`, {
      method: "POST", // Ou o método HTTP correto
      headers: {
        "Content-Type": "application/json",
      },
      // Se necessário, envie dados no corpo da requisição
      body: JSON.stringify({}),
    });
    if (response.ok) {
      console.log("Chamada para a rota realizada com sucesso!");
    } else {
      console.error("Erro ao chamar a rota:", response.status);
    }
  } catch (error) {
    console.error("Erro ao chamar a rota:", error);
  }
};

const executeTaskRelatorioMensal = async () => {
  try {
    // Faz a chamada para sua rota
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/notify/relatorios`,
      {
        method: "POST", // Ou o método HTTP correto
        headers: {
          "Content-Type": "application/json",
        },
        // Se necessário, envie dados no corpo da requisição
        body: JSON.stringify({}),
      }
    );
    if (response.ok) {
      console.log("Chamada para a rota realizada com sucesso!");
    } else {
      console.error("Erro ao chamar a rota:", response.status);
    }
  } catch (error) {
    console.error("Erro ao chamar a rota:", error);
  }
};

// Agenda a tarefa para ser executada diariamente às 8h da manhã
cron.schedule("0 8 * * *", async () => {
  console.log("Executando tarefa agendada...");
  await executeTask();
});

cron.schedule("0 8 1 * *", async () => {
  console.log("Executando tarefa agendada...");
  await executeTaskRelatorioMensal();
});

const dev = process.env.NODE_ENV !== "production";
const react_app = next({ dev });
const app = express();
const PORT = 3000;

react_app.prepare().then(() => {
  process.title = "🧰 - Cash Care WebServer";
  console.log("[NextJS] Application initialized");

  const handle = react_app.getRequestHandler();

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.get(
    "/pdf/movimentacoes/:userId/:month/:unitId/:docname",
    async (req, res) => {
      const { month, unitId, userId } = req.params;

      if (!month || !unitId || !userId) {
        return res.status(400).send("Parâmetros inválidos");
      }

      try {
        const movements_saidas = await query(
          `
          SELECT 
          m.id,
          m.type, 
          m.description, 
          m."categoryId", 
          m."paymentMethod",
          c.description AS category, 
          TO_CHAR(m.date, 'DD/MM/YYYY') AS formatted_date, 
          ROUND(m.value::numeric, 2) AS formatted_value
      FROM 
          movements m
      INNER JOIN 
          categories c ON m."categoryId" = c.id
      WHERE 
          m."unitId" = $1
          AND m.date >= DATE_TRUNC('month', $2::date)
          AND m.date < (DATE_TRUNC('month', $2::date) + INTERVAL '1 month')
          AND m."userId" = $3
          AND m.type = 'saida'
      ORDER BY 
          m.date ASC
        `,
          [unitId, `${month}-01`, userId]
        );

        const movements_entradas = await query(
          `
          SELECT 
          m.id,
          m.type, 
          m.description, 
          m."categoryId",
          m."paymentMethod", 
          c.description AS category, 
          TO_CHAR(m.date, 'DD/MM/YYYY') AS formatted_date, 
          ROUND(m.value::numeric, 2) AS formatted_value
      FROM 
          movements m
      INNER JOIN 
          categories c ON m."categoryId" = c.id
      WHERE 
          m."unitId" = $1
          AND m.date >= DATE_TRUNC('month', $2::date)
          AND m.date < (DATE_TRUNC('month', $2::date) + INTERVAL '1 month')
          AND m."userId" = $3
          AND m.type = 'entrada'
      ORDER BY 
          m.date ASC
        `,
          [unitId, `${month}-01`, userId]
        );

        const unit = await query(
          `SELECT description FROM units WHERE id = $1 AND "userId" = $2`,
          [unitId, userId]
        );

        const unit_name = unit.rows[0].description;

        const template = "pdf-moviments.ejs";
        const html = await generateReport(template, {
          month: formatDateString(month),
          unit: unit_name,
          movements_entradas: movements_entradas.rows,
          movements_saidas: movements_saidas.rows,
        });
        const doc = await genPDF(html, {
          format: "A4",
          margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
        });
        res.setHeader("Content-Type", "application/pdf");
        res.send(doc);
      } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao gerar o PDF.");
      }
    }
  );

  app.get(
    "/pdf/contas-a-pagar/:userId/:month/:unitId/:docname",
    async (req, res) => {
      const { month, unitId, userId } = req.params;

      if (!month || !unitId || !userId) {
        return res.status(400).send("Parâmetros inválidos");
      }

      try {
        const unit = await query(
          `SELECT description FROM units WHERE id = $1 AND "userId" = $2`,
          [unitId, userId]
        );

        const installments = await query(
          `SELECT description,
          status,
          "installmentNumber",           
          TO_CHAR(date, 'DD/MM/YYYY') AS formatted_date, 
          ROUND(value::numeric, 2) AS formatted_value 
          FROM installments 
          WHERE "unitId" = $1 
          AND "userId" = $2
          AND date >= DATE_TRUNC('month', $3::date)
          AND date < (DATE_TRUNC('month', $3::date) + INTERVAL '1 month')
          ORDER BY date DESC`,

          [unitId, userId, `${month}-01`]
        );

        const unit_name = unit.rows[0].description;

        const template = "pdf-contas.ejs";
        const html = await generateReport(template, {
          month: formatDateString(month),
          unit: unit_name,
          installments: installments.rows,
        });
        const doc = await genPDF(html, {
          format: "A4",
          margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
        });
        res.setHeader("Content-Type", "application/pdf");
        res.send(doc);
      } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao gerar o PDF.");
      }
    }
  );

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
