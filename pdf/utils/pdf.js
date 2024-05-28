const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const html_to_pdf = require("html-pdf-node");

// Função para gerar PDF a partir de HTML
function html2pdf(html, options = {}) {
  if (!options.format && !options.width) options.format = "A4";
  const file = { content: html };
  return html_to_pdf.generatePdf(file, options);
}

// Função para gerar PDF a partir de HTML com opções adicionais
async function genPDF(html, options = {}) {
  try {
    const pdf = await html2pdf(html, { printBackground: true, ...options });
    return pdf;
  } catch (err) {
    throw err;
  }
}

// Função para gerar relatório com base em um template EJS e dados fornecidos
function generateReport(template, data, options) {
  const VIEWS_PATH = path.join(__dirname, "views", "relatorios");
  const PUBLIC_PATH = path.join(__dirname, "public");

  return new Promise((resolve, reject) => {
    const ejs_options = {
      views: [VIEWS_PATH],
      // delimiter: "?",
      ...options,
      async: true,
    };

    const filename = path.resolve(
      VIEWS_PATH,
      template.toLowerCase().endsWith(".ejs") ? template : `${template}.ejs`
    );
    const file_content = fs.readFileSync(filename, "utf8");

    // Processando o conteúdo do arquivo
    let processed_content = file_content.replace(
      /<link(.*)href="(?<filename>.*)"(\s?)(\/?)>/gm,
      function (match, p1, filename) {
        const file = path.join(PUBLIC_PATH, filename);
        const file_content = fs.readFileSync(file, "utf8");
        return `<style>${file_content}</style>`;
      }
    );

    processed_content = processed_content.replace(
      /<img[^>]*src="\/(?<filename>[^"]*)"/gm,
      function (match, filename) {
        const file = path.join(PUBLIC_PATH, filename);
        const file_content = fs.readFileSync(file, "base64");
        return `<img src="data:image/png;base64,${file_content}"`;
      }
    );

    try {
      const rendered = ejs.render(processed_content, data, ejs_options);
      resolve(rendered);
    } catch (err) {
      reject(err);
    }
  });
}

// Função para gerar documento com base em um template, dados, opções e opções de PDF
async function genDoc(template, data = {}, options = {}, pdf_options = {}) {
  try {
    const html = await generateReport(template, data, options);
    const doc = await genPDF(html, pdf_options);
    return doc;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  generateReport,
  genPDF,
  genDoc,
};
