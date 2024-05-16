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

  if (session.user.situacao === "I") {
    redirect("/blocked-user");
  }

  if (session.user.perfil === "admin") {
    redirect("/admin");
  }

  return (
    <section>
      <Header session={session} />
      {children}
    </section>
  );
}
