import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/session";
import { redirect, useRouter } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/");
  }

  if (session.user.perfil === "admin") {
    redirect("/admin");
  }

  if (session.user.situacao === "I") {
    if (session.user.perfil === "test") {
      redirect("/test-over");
    }
    redirect("/blocked-user");
  }

  return (
    <section>
      <Header session={session} />
      {children}
    </section>
  );
}
