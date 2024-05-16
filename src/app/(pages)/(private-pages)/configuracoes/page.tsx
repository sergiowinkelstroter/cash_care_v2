import { PageContainer } from "@/components/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Perfil } from "./components/Perfil";
import { Unidade } from "./components/Unidade";
import { Categoria } from "./components/Categorias";

export default function Configuracoes() {
  return (
    <PageContainer>
      <Tabs defaultValue="pf">
        <div className="flex flex-col px-4 md:px-8">
          <TabsList className="w-[230px]">
            <TabsTrigger value="pf">Perfil</TabsTrigger>
            <TabsTrigger value="un">Unidade</TabsTrigger>
            <TabsTrigger value="ca">Categoria</TabsTrigger>
          </TabsList>

          <div className="w-full">
            <TabsContent value="pf">
              <Perfil />
            </TabsContent>
            <TabsContent value="un">
              <Unidade />
            </TabsContent>
            <TabsContent value="ca">
              <Categoria />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </PageContainer>
  );
}
