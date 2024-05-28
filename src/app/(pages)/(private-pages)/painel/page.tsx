import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { MenuClassic } from "./components/MenuClassic";
import { PageContainer } from "@/components/PageContainer";

export default async function Painel() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/");
  }

  return (
    <PageContainer>
      <MenuClassic userId={session.user.id} />
    </PageContainer>
  );
}
