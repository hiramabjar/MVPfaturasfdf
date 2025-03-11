"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, File, X, Check } from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onUploadComplete?: (invoice: Partial<Invoice>) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Simular progresso de upload
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isUploading) {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            setIsProcessing(true);
            processFile();
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isUploading]);

  // Configurar eventos de drag and drop
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const highlight = () => setIsDragging(true);
    const unhighlight = () => setIsDragging(false);

    // Prevenir comportamento padrão para permitir drop
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unhighlight, false);
      });
    };
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Verificar tipo de arquivo
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, envie apenas arquivos PDF, JPG ou PNG.",
        variant: "destructive",
      });
      return;
    }

    // Verificar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadProgress(0);
    setIsUploading(true);

    // Criar preview para imagens
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      // Para PDFs, usamos um ícone
      setFilePreview(null);
    }
  };

  const processFile = () => {
    // Simulação de processamento OCR/extração de dados
    setTimeout(() => {
      setIsProcessing(false);

      // Dados extraídos da fatura
      const extractedInvoice: Partial<Invoice> = {
        creditor: "Sabesp",
        description: "Conta de água - Junho/2023",
        amount: 105.32,
        dueDate: "20/06/2023",
        paymentMethod: "boleto",
        barcode: "34191790010104351004791020150008291070026000",
      };

      if (onUploadComplete) {
        onUploadComplete(extractedInvoice);
      }

      toast({
        title: "Processamento concluído",
        description: `Fatura de ${extractedInvoice.creditor} extraída com sucesso.`,
      });

      // Limpar arquivo após processamento
      setUploadedFile(null);
      setFilePreview(null);
    }, 3000);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

  return (
    <div
      ref={dropAreaRef}
      className={`bg-muted/40 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 border-2 border-dashed ${isDragging ? "border-primary" : "border-muted"} transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {isUploading ? (
        <div className="text-center w-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h3 className="font-medium text-lg mt-4">Enviando arquivo...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {uploadProgress}% concluído
          </p>
          <div className="w-full bg-muted rounded-full h-2.5 mt-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      ) : isProcessing ? (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h3 className="font-medium text-lg mt-4">Processando fatura...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Estamos extraindo as informações da sua fatura usando OCR.
          </p>
        </div>
      ) : uploadedFile ? (
        <div className="w-full">
          <div className="flex items-center justify-between p-4 bg-background rounded-md">
            {filePreview ? (
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded overflow-hidden">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadProgress(0);
                  setIsUploading(true);
                }}
              >
                <Check className="h-4 w-4 mr-1" /> Processar
              </Button>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <FileUp className="h-12 w-12 text-primary/60" />
          <div className="text-center">
            <h3 className="font-medium text-lg">
              Arraste e solte arquivos aqui
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Suporta arquivos PDF, JPG e PNG. Tamanho máximo de 10MB.
            </p>
          </div>
          <Button className="mt-2" onClick={triggerFileInput}>
            Selecionar Arquivo
          </Button>
        </>
      )}
    </div>
  );
}
