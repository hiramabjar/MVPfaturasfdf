"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, File, X } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsUploading(true);

    // Simulação de upload
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);

      // Simulação de processamento
      setTimeout(() => {
        setIsProcessing(false);

        // Dados simulados da fatura
        const mockInvoice: Partial<Invoice> = {
          creditor: "Sabesp",
          description: "Conta de água - Junho/2023",
          amount: 105.32,
          dueDate: "20/06/2023",
          paymentMethod: "boleto",
          barcode: "34191790010104351004791020150008291070026000",
        };

        if (onUploadComplete) {
          onUploadComplete(mockInvoice);
        }

        toast({
          title: "Processamento concluído",
          description: `Fatura de ${mockInvoice.creditor} extraída com sucesso.`,
        });

        // Limpar arquivo após processamento
        setUploadedFile(null);
      }, 3000);
    }, 2000);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div
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
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h3 className="font-medium text-lg mt-4">Enviando arquivo...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Aguarde enquanto enviamos seu arquivo.
          </p>
        </div>
      ) : isProcessing ? (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h3 className="font-medium text-lg mt-4">Processando fatura...</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Estamos extraindo as informações da sua fatura.
          </p>
        </div>
      ) : uploadedFile ? (
        <div className="w-full">
          <div className="flex items-center justify-between p-4 bg-background rounded-md">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
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
