"use client";

import { useEffect, useRef, useState } from "react";

export function QrCodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Verificar permissões de câmera
    const checkPermission = async () => {
      try {
        // Verificar se a API de mídia está disponível
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("API de mídia não suportada neste navegador");
        }

        // Tentar acessar a câmera para verificar permissões
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Se chegou aqui, temos permissão
        setHasPermission(true);

        // Limpar o stream de teste
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("Erro ao verificar permissões de câmera:", error);
        setHasPermission(false);
      }
    };

    checkPermission();

    // Limpar recursos quando o componente for desmontado
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Função para iniciar o scanner
  const startScanner = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Usar câmera traseira em dispositivos móveis
      });

      setStream(mediaStream);
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Erro ao iniciar o scanner:", error);
      setHasPermission(false);
    }
  };

  // Função para parar o scanner
  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Exibir mensagem enquanto verifica permissões
  if (hasPermission === null) {
    return (
      <div className="text-center">Verificando permissões de câmera...</div>
    );
  }

  // Exibir mensagem se não tiver permissão
  if (hasPermission === false) {
    return (
      <div className="text-center text-red-500">
        Sem acesso à câmera. Por favor, permita o acesso à câmera para escanear
        QR codes.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {isScanning ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-md"
            autoPlay
            playsInline
            muted
          />
          {/* Guia de escaneamento */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white border-dashed rounded-md opacity-70" />
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center space-y-2 cursor-pointer w-full h-full"
          onClick={startScanner}
        >
          <div className="w-48 h-48 border-2 border-dashed border-primary/50 rounded-md flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect width="14" height="14" x="5" y="5" rx="1" />
              <path d="M9 9h1v1H9z" />
              <path d="M14 9h1v1h-1z" />
              <path d="M9 14h1v1H9z" />
              <path d="M14 14h1v1h-1z" />
              <path d="M1 1h4v4" />
              <path d="M19 1h4v4" />
              <path d="M1 19h4v4" />
              <path d="M19 19h4v4" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Clique para ativar a câmera
          </p>
        </div>
      )}
    </div>
  );
}
