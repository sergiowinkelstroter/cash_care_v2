"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CircleDollarSign,
  Settings,
  TrendingUp,
  Layout,
  CreditCard,
  DollarSign,
  Phone,
  MapPin,
  Mail,
  X,
  Menu,
  Bell,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <header className="bg-white fixed inset-x-0 top-0">
        <div className="container flex py-4 justify-between items-center">
          <Link href="/#home">
            <CircleDollarSign size={32} />
          </Link>
          <nav className="md:flex gap-8 hidden">
            <ul className="flex gap-4 items-center justify-center">
              <li className="hover:underline">
                <Link href="#sobre">Sobre</Link>
              </li>
              <li className="hover:underline">
                <Link href="#funcionalidades">Funcionalidades</Link>
              </li>
              <li className="hover:underline">
                <Link href="#contato">Contato</Link>
              </li>
            </ul>
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="flex justify-between items-center">
                <Link href="/#home">
                  <DollarSign />
                </Link>
                <SheetClose />
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <ul className="flex flex-col gap-4 ">
                  <li className="hover:underline">
                    <Link href="#sobre">
                      <SheetClose>Sobre</SheetClose>
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="#funcionalidades">
                      <SheetClose>Funcionalidades</SheetClose>
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="#contato">
                      <SheetClose>Contato</SheetClose>
                    </Link>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="">
        <section
          id="home"
          className="container flex flex-col md:flex-row gap-20 items-center  justify-center pt-8 md:pt-16 my-16"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 ">
              <h1 className="text-3xl md:text-5xl font-bold">
                Simplifique sua Gestão Financeira com Cash Care!
              </h1>
              <p className="text-sm md:text-lg">
                Controle suas finanças pessoais e empresariais de forma
                eficiente e segura.
              </p>
            </div>
            <Button asChild>
              <Link href="/register">Experimentar gratuitamente</Link>
            </Button>
          </div>
          <div className="w-full md:flex justify-center items-center hidden">
            <Image src="/hero.png" alt="cashcare" width={300} height={300} />
          </div>
        </section>
        <section id="sobre" className="py-16 bg-black/90">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex justify-center w-full md:w-1/3 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-full md:hidden">
                  <DollarSign className="text-black" size={34} />
                </div>
                <div className="bg-white p-6 rounded-full hidden md:block">
                  <DollarSign className="text-black" size={64} />
                </div>
              </div>
              <div className="w-full md:w-2/3 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Sobre o Sistema
                </h3>
                <p className="text-sm md:text-lg text-justify">
                  Cash Care é um sistema inovador de controle financeiro,
                  desenvolvido para oferecer uma solução completa e acessível
                  para indivíduos e pequenas empresas. Nosso objetivo é
                  transformar a maneira como você gerencia suas finanças,
                  proporcionando uma plataforma robusta, mas fácil de usar, que
                  se adapta às suas necessidades específicas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="py-16 ">
          <div className="container">
            <h3 className="text-2xl md:text-4xl font-bold  text-center mb-12">
              Como a Cash Care pode te ajudar?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* <div className="flex flex-col gap-4"> */}
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <Layout size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Painel Dinâmico
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Gerencie seus gastos e receitas de forma eficiente e eficaz.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <TrendingUp className="text-black" size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Gerenciamento de Movimentações
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Controle todas as transações financeiras com facilidade.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <CreditCard className="text-black" size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Controle de Contas a Pagar
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Organize contas com parcelas e acompanhe pagamentos de forma
                    eficiente.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <Bell className="text-black" size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Notificações via WhatsApp
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Receba notificações sobre as contas a pagar do dia.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <FileText className="text-black" size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Relatórios em PDF
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Gere relatórios mensais para uma análise detalhada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
              <Card className="bg-black/90 p-6 rounded-lg shadow-md">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full mb-4">
                    <Settings className="text-black" size={32} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    Configurações Personalizadas
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure unidades e categorias de acordo com suas
                    necessidades.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center"></CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="contato" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                Entre em Contato
              </h2>
              <p className="text-sm md:text-lg">
                Estamos aqui para ajudar. Entre em contato conosco para mais
                informações.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center flex-col">
                <Mail size={64} className="text-gray-500 mb-4" />
                <p className="text-lg font-semibold mb-2">E-mail</p>
                <p className="text-gray-600">cashcare.cloud@gmail.com</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <Phone size={64} className="text-gray-500 mb-4" />
                <p className="text-lg font-semibold mb-2">Telefone</p>
                <p className="text-gray-600">(99) 99152-9825</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <MapPin size={64} className="text-gray-500 mb-4" />
                <p className="text-lg font-semibold mb-2">Localização</p>
                <p className="text-gray-600">Açailândia - MA</p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta-secundario" className="py-16 bg-black/90 text-white">
          <div className="container text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">
              Pronto para transformar sua gestão financeira?
            </h3>
            <p className="text-sm md:text-lg mb-8">
              Inscreva-se agora para uma demonstração gratuita e descubra como a
              Cash Care pode ajudar você a alcançar o controle total sobre suas
              finanças.
            </p>
            <Button asChild variant={"outline"}>
              <Link href="/register" className="text-black">
                Demonstração Gratuita
              </Link>
            </Button>
          </div>
        </section>

        {/* <section id="beneficios"></section> */}
      </main>
      <footer className="bg-black/90 py-4 text-center">
        <p className="text-gray-600 text-sm md:text-base ">Cash Care</p>
      </footer>
    </div>
  );
}
