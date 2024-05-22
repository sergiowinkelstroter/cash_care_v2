"use client";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function BlockedUser() {
  const { data: session } = useSession();
  async function handleSignOut() {
    await signOut({
      redirect: false,
    });
    redirect("/login");
  }
  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen  items-center justify-center ">
      <div className="flex flex-col gap-4 items-center max-w-[300px]">
        <Lock className="h-16 w-16" />
        <p className="text-center text-muted-foreground">
          O seu acesso foi bloqueado!
        </p>
        <Button
          variant="destructive"
          onClick={async () => await handleSignOut()}
          className="w-full"
        >
          Sair
        </Button>
      </div>
    </main>
  );
}
