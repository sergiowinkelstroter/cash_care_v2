"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, MessageCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export function PageTestOver() {
  const router = useRouter();
  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const handleContact = () => {
    const phoneNumber = "5599991529825";
    const message = "Olá, gostaria de renovar minha assinatura do Cash Care.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-4 items-center max-w-[300px] bg-white p-6 rounded-lg shadow-md">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h1 className="text-xl font-bold text-center">
          Período de Teste Expirado
        </h1>
        <p className="text-center text-gray-600">
          Seu período de teste gratuito terminou. Para continuar usando o Cash
          Care, por favor, entre em contato conosco para renovar sua assinatura.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <Button variant="default" onClick={handleContact} className="w-full">
            <MessageCircle className="mr-2" size={16} />
            Contatar via WhatsApp
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full"
          >
            Sair
          </Button>
        </div>
      </div>
    </main>
  );
}
