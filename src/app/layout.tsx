import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import GoogleAnalytics from "./GoogleAnalytics";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cash Care",
  description:
    "Descubra a Cash Care, o sistema inovador de gestão financeira para indivíduos e pequenas empresas. Controle suas finanças com facilidade, organize contas, receba notificações e gere relatórios detalhados. Experimente gratuitamente e transforme sua gestão financeira com a Cash Care.",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TooltipProvider>
        <body
          className={cn("font-sans antialiased bg-gray-200", fontSans.variable)}
        >
          <GoogleAnalytics />
          {children}
          <Toaster />
        </body>
      </TooltipProvider>
    </html>
  );
}
