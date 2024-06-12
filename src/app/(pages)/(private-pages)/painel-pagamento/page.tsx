"use client";
import { PageContainer } from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { createStaticPix, hasError } from "pix-utils";
import { useQRCode } from "next-qrcode";
import { Loading } from "@/components/Loading";

export default function PainelPagamento() {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const { Canvas } = useQRCode();

  function GenerateCodigo() {
    try {
      const pix = createStaticPix({
        merchantName: "Sergio Winkelstroter",
        merchantCity: "Açailândia",
        pixKey: "winksousa0@gmail.com",
        infoAdicional: "Cash Care - Mensalidade",
        transactionAmount: 79.9,
      });

      if (!hasError(pix)) {
        const brCode = pix.toBRCode();
        setCode(brCode);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GenerateCodigo();
  }, []);

  function copyCode() {
    try {
      navigator.clipboard.writeText(code);
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar!",
        description: "Erro ao copiar o código para a área de transferência.",
      });
    }
  }

  return (
    <PageContainer>
      <div className="flex justify-center items-center mt-12 md:mt-28">
        <Card className="w-[350px] md:w-[700px]">
          <CardHeader>
            <CardTitle>Painel Pagamento</CardTitle>
            <CardDescription>
              Use o QrCode abaixo para pagar sua mensalidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {code.length > 0 ? (
              <>
                <div className="flex justify-center">
                  <Canvas
                    text={code}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 250,
                      color: {
                        dark: "#000000FF",
                        light: "#FFFFFFFF",
                      },
                    }}
                  />
                </div>
                <div className="flex justify-center flex-col items-center mt-4">
                  <span className="text-sm sm:hidden">
                    {code.substring(0, 40)}...
                  </span>
                  <span className="text-sm hidden sm:block">
                    {code.substring(0, 60)}...
                  </span>
                  <span
                    className="cursor-pointer text-sm font-medium hover:bg-gray-200 p-1 rounded-md"
                    onClick={() => copyCode()}
                  >
                    Copiar código
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <Loading />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
