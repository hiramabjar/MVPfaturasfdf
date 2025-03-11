"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Check, Loader2 } from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface ScannerControllerProps {
  type: "barcode" | "qrcode";
  onScanComplete?: (data: Partial<Invoice>) => void;
}

export function ScannerController({
  type,
  onScanComplete,
}: ScannerControllerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const router = useRouter();

  const startScanning = () => {
    setIsScanning(true);

    // Simulação de escaneamento
    setTimeout(() => {
      setIsScanning(false);
      setIsProcessing(true);

      // Simulação de processamento
      setTimeout(() => {
        setIsProcessing(false);
        setScanComplete(true);

        // Dados simulados baseados no tipo de escaneamento
        const mockData: Partial<Invoice> =
          type === "barcode"
            ? {
                creditor: "Enel Energia",
                description: "Conta de energia - Junho/2023",
                amount: 195.67,
                dueDate: "15/06/2023",
                paymentMethod: "boleto",
                barcode: "34191790010104351004791020150008291070026000",
              }
            : {
                creditor: "Condomínio Edifício Aurora",
                description: "Taxa condominial - Junho/2023",
                amount: 450.0,
                dueDate: "10/06/2023",
                paymentMethod: "pix",
                pixCode:
                  "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142a1dd1d55520400005303986540510.005802BR5913Condominio6008Sao Paulo62070503***6304E2CA",
              };

        if (onScanComplete) {
          onScanComplete(mockData);
        }

        toast({
          title: "Escaneamento concluído",
          description: `Fatura de ${mockData.creditor} detectada com sucesso.`,
        });

        // Resetar após alguns segundos
        setTimeout(() => {
          setScanComplete(false);
        }, 3000);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {scanComplete ? (
        <Button
          className="w-full max-w-md bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/dashboard")}
        >
          <Check className="mr-2 h-4 w-4" /> Escaneamento Concluído
        </Button>
      ) : isProcessing ? (
        <Button className="w-full max-w-md" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
        </Button>
      ) : isScanning ? (
        <Button className="w-full max-w-md" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Escaneando...
        </Button>
      ) : (
        <Button className="w-full max-w-md" onClick={startScanning}>
          <Camera className="mr-2 h-4 w-4" /> Iniciar Captura
        </Button>
      )}
    </div>
  );
}
