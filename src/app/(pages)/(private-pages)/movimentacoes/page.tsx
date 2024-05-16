"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovimentacoesCaixa } from "./components/Movimentacoes";
import { ContasAPagar } from "./components/ContasPagar";
import { PageContainer } from "@/components/PageContainer";

export default function Movimentacoes() {
  return (
    <PageContainer>
      <Tabs defaultValue="tr">
        <div className="flex flex-col px-4 md:px-8">
          <TabsList className="w-[250px]">
            <TabsTrigger value="tr">Movimentações</TabsTrigger>
            <TabsTrigger value="cp">Contas a pagar</TabsTrigger>
          </TabsList>

          <div className="w-full">
            <TabsContent value="tr">
              <MovimentacoesCaixa />
            </TabsContent>
            <TabsContent value="cp">
              <ContasAPagar />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </PageContainer>
  );
}
