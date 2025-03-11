"use client";

import { useState, useRef, useEffect } from "react";
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startScanning = async () => {
    try {
      setIsScanning(true);

      // Solicitar acesso à câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();

        // Aguardar um tempo para a câmera inicializar
        setTimeout(() => {
          captureFrame();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      setIsScanning(false);
      toast({
        title: "Erro",
        description:
          "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Definir dimensões do canvas para corresponder ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Parar o streaming de vídeo
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setIsScanning(false);
    setIsProcessing(true);

    // Processar a imagem capturada
    processImage(canvas);
  };

  const processImage = (canvas: HTMLCanvasElement) => {
    // Em uma implementação real, aqui você usaria uma biblioteca como
    // zxing ou quagga para processar o código de barras/QR code

    // Simulação de processamento
    setTimeout(() => {
      setIsProcessing(false);
      setScanComplete(true);

      // Dados baseados no tipo de escaneamento
      const invoiceData: Partial<Invoice> =
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
        onScanComplete(invoiceData);
      }

      toast({
        title: "Escaneamento concluído",
        description: `Fatura de ${invoiceData.creditor} detectada com sucesso.`,
      });

      // Resetar após alguns segundos
      setTimeout(() => {
        setScanComplete(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Canvas escondido para processamento */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Vídeo para exibir o feed da câmera */}
      {isScanning && (
        <div className="relative w-full max-w-md aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {type === "barcode" ? (
              <div className="w-4/5 h-16 border-2 border-white border-dashed rounded-md opacity-70" />
            ) : (
              <div className="w-48 h-48 border-2 border-white border-dashed rounded-md opacity-70" />
            )}
          </div>
        </div>
      )}

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
        <Button className="w-full max-w-md" onClick={captureFrame}>
          <Camera className="mr-2 h-4 w-4" /> Capturar
        </Button>
      ) : (
        <Button className="w-full max-w-md" onClick={startScanning}>
          <Camera className="mr-2 h-4 w-4" /> Iniciar Câmera
        </Button>
      )}
    </div>
  );
}
