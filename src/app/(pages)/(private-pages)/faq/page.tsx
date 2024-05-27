"use client";
import { PageContainer } from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Como posso associar uma categoria a uma unidade?",
    answer: `
    Para associar uma categoria a uma unidade, vá até a página de configurações e acesse a seção de unidades. Selecione a unidade desejada, clique em "Adicionar categoria" e escolha a categoria que você quer associar.
      `,
  },
  {
    question: "Errei os dados de uma conta a pagar, o que fazer?",
    answer:
      "Para editar uma conta a pagar, vá até a página de movimentações e acesse a seção de contas a pagar. Clique em 'Contas' e selecione a conta que você deseja editar. Lembre-se de que, ao editar uma conta, todas as parcelas anteriormente criadas serão apagadas e recriadas com as novas informações.",
  },
  {
    question: "Como posso receber notificações das minhas contas a pagar?",
    answer:
      "Ative as notificações de contas a pagar na página de configurações, na seção de perfil. Você receberá lembretes via WhatsApp sobre as suas contas a pagar. Essa ação não está disponível para perfis em período de teste.",
  },
  {
    question: "Posso alterar minha senha?",
    answer:
      "Sim. Para alterar sua senha, vá para as configurações do seu perfil e selecione a opção 'Alterar Senha'.",
  },
  {
    question: "Meu teste gratuito está acabando, o que fazer?",
    answer:
      "Entre em contato conosco via WhatsApp para ativar sua assinatura antes que o período gratuito termine.",
  },
  {
    question: "Como faço para criar uma nova unidade?",
    answer:
      "Para criar uma nova unidade, vá até a página de configurações, acesse a seção de unidades e clique em 'Adicionar'. Preencha todos os campos obrigatórios. Lembre-se que o limite máximo é de 3 unidades.",
  },
  {
    question: "Existe um limite de movimentações que posso registrar?",
    answer:
      "Não, você pode registrar quantas movimentações quiser, sem limite.",
  },
  {
    question: "Posso excluir uma unidade?",
    answer:
      "Sim. Para excluir uma unidade, vá até a página de configurações, acesse a seção de unidades, selecione a unidade que deseja excluir e clique em 'Deletar'. Esta ação é irreversível. Recomendamos marcar a unidade como 'Inativa' para evitar a exclusão permanente e permitir a criação de novas unidades sem exceder o limite.",
  },
];

export default function Faq() {
  const handleContact = () => {
    const phoneNumber = "5599991529825";
    const message = "";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <PageContainer>
      <Tabs defaultValue="faq">
        <div className="flex flex-col px-4 md:px-8">
          <TabsList className="w-[65px]">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="faq">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Perguntas frequentes</CardTitle>
                <CardDescription>
                  Aqui você encontrará as respostas para as perguntas que podem
                  sugir durante o uso do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                {faqs.map((faq, index) => (
                  <Accordion type="single" collapsible key={faq.question}>
                    <AccordionItem value={`item-${index + 1}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleContact}
                  className=""
                >
                  <MessageCircle className="mr-2" size={16} />
                  Enviar pergunta
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </PageContainer>
  );
}
