import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
// import { MenuBasic } from "./componentes/MenuBasic";
import Admin from "../../admin/page";
import { MenuClassic } from "./components/MenuClassic";
import { PageContainer } from "@/components/PageContainer";

export default async function Painel() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/");
  }

  switch (session.user.perfil) {
    // case "admin":
    //   return <Admin />;
    // case "basic":
    //   return <MenuBasic />;

    case "classic":
      return (
        <PageContainer>
          <MenuClassic />
        </PageContainer>
      );
  }
}
