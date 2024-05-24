"use client";
import { useEffect, useState } from "react";
import { differenceInSeconds, addDays } from "date-fns";
import Countdown from "react-countdown";
import { Session } from "next-auth";
import Link from "next/link";
import {
  ArrowUpDown,
  CircleDollarSign,
  Clock,
  DollarSign,
  Home,
  PanelLeft,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toZonedTime } from "date-fns-tz";

interface HeaderProps {
  session: Session | null;
}

export const Header = ({ session }: HeaderProps) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const timeZone = "America/Sao_Paulo";

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  useEffect(() => {
    if (session?.user && session.user.createdAt) {
      const createdAt = new Date(session.user.createdAt);
      const localCreatedAt = toZonedTime(createdAt, timeZone);
      const trialEndDate = addDays(localCreatedAt, 7);
      const now = new Date();
      const secondsLeft = differenceInSeconds(trialEndDate, now);

      if (secondsLeft > 0) {
        setTimeLeft(secondsLeft);
      } else {
        api.put(`/users?id=${session.user.id}&situacao=A`).then(() => {
          signOut({
            redirect: false,
          }).then(() => {
            router.push("/");
          });
          router.push("/");
        });
      }
    }
  }, [session, router]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/painel"
            className="group flex h-9 w-9 items-center justify-center rounded-lg  text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <CircleDollarSign />
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/painel"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Painel</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Painel</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/movimentacoes"
                className="flex h-9 w-9 items-center justify-center rounded-lg  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ArrowUpDown className="h-5 w-5" />
                <span className="sr-only">Movimentacoes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Movimentações</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/configuracoes"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {session?.user.perfil === "test" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock color="#2bff00" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {<Countdown date={Date.now() + timeLeft * 1000} />}
              </TooltipContent>
            </Tooltip>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-44 ml-5 text-center flex flex-col items-center justify-center"
            >
              <DropdownMenuLabel className="text-xs">
                {session?.user?.name?.toUpperCase()}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs">
                {session?.user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session?.user?.perfil !== "test" && (
                <DropdownMenuItem
                  onClick={() => router.push("/painel-pagamento")}
                  className="w-full text-center"
                >
                  Painel de Pagamento
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => router.push("/faq")}
                className="w-full text-center"
              >
                FAQ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/configuracoes")}
                className="w-full text-center"
              >
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLogout()} asChild>
                <Button variant={"destructive"} className="w-full">
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-base font-medium ">
                <Link
                  href="/painel"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <SheetClose>
                    <DollarSign className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                  </SheetClose>
                </Link>
                <Link href="/painel">
                  <SheetClose className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-4">
                    <Home className="h-5 w-5" />
                    Painel
                  </SheetClose>
                </Link>
                <Link href="/movimentacoes">
                  <SheetClose className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-4">
                    <ShoppingCart className="h-5 w-5" />
                    Movimentações
                  </SheetClose>
                </Link>
                {/* <Link href="/analise">
                  <SheetClose className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-4">
                    <LineChart className="h-5 w-5" />
                    Análise
                  </SheetClose>
                </Link> */}
                <Link href="/configuracoes">
                  <SheetClose className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground mt-4">
                    <Settings className="h-5 w-5" />
                    Configurações
                  </SheetClose>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 sm:hidden">
            {session?.user.perfil === "test" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Clock color="#2bff00" />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {<Countdown date={Date.now() + timeLeft * 1000} />}
                </TooltipContent>
              </Tooltip>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="sm:hidden" asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-44 mr-5 text-center flex flex-col items-center justify-center"
              >
                <DropdownMenuLabel className="text-xs">
                  {session?.user?.name?.toUpperCase()}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs">
                  {session?.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session?.user?.perfil !== "test" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/painel-pagamento")}
                    className="w-full text-center"
                  >
                    Painel de Pagamento
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push("/faq")}
                  className="w-full text-center"
                >
                  FAQ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/configuracoes")}
                  className="w-full text-center"
                >
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()} asChild>
                  <Button variant={"destructive"} className="w-full">
                    Sair
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
    </>
  );
};
