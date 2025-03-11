"use client";

import { useEffect, useRef, useState } from "react";

export function QrCodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // This is a placeholder component - in a real implementation, you would use
  // a library like @zxing/library or html5-qrcode to scan QR codes

  useEffect(() => {
    // Simulating camera permission check
    const checkPermission = async () => {
      try {
        // In a real implementation, you would check camera permissions here
        setHasPermission(true);
      } catch (error) {
        console.error("Error checking camera permission:", error);
        setHasPermission(false);
      }
    };

    checkPermission();

    return () => {
      // Clean up camera resources if needed
    };
  }, []);

  if (hasPermission === null) {
    return (
      <div className="text-center">Verificando permissões de câmera...</div>
    );
  }

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
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-md"
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
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
          <p className="text-sm text-muted-foreground">QR Code PIX</p>
        </div>
      )}
    </div>
  );
}
