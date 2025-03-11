"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { QrCodeScanner } from "../scanner/qr-code-scanner";
import { BarcodeScanner } from "../scanner/barcode-scanner";
import { ScannerController } from "../scanner/scanner-controller";
import { WhatsAppImport } from "../import/whatsapp-import";
import { GmailImport } from "../import/gmail-import";
import { FileUpload } from "../import/file-upload";
import { Invoice } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export function AddInvoiceForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Invoice>>({
    creditor: "",
    description: "",
    amount: 0,
    dueDate: "",
    paymentMethod: "boleto",
    barcode: "",
    pixCode: "",
  });
  const [date, setDate] = useState<Date>();
  const [captureMethod, setCaptureMethod] = useState("manual");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value as "boleto" | "pix" | "credit_card" | "other",
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dueDate: date.toLocaleDateString("pt-BR"),
      }));
    }
  };

  const handleScanComplete = (data: Partial<Invoice>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCaptureMethod("manual");
    toast({
      title: "Dados capturados",
      description: "Os dados da fatura foram preenchidos automaticamente.",
    });
  };

  const handleImportComplete = (invoices: Partial<Invoice>[]) => {
    if (invoices.length > 0) {
      setFormData((prev) => ({ ...prev, ...invoices[0] }));
      setCaptureMethod("manual");
      toast({
        title: "Fatura importada",
        description: "Os dados da fatura foram preenchidos automaticamente.",
      });
    }
  };

  const handleSaveInvoice = () => {
    // Validação básica
    if (!formData.creditor || !formData.amount || !formData.dueDate) {
      toast({
        title: "Dados incompletos",
        description:
          "Por favor, preencha os campos obrigatórios: Credor, Valor e Data de Vencimento.",
        variant: "destructive",
      });
      return;
    }

    // Simulação de salvamento
    toast({
      title: "Fatura salva",
      description: "A fatura foi salva com sucesso.",
    });

    // Redirecionar para o dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalhes da Fatura</CardTitle>
        <CardDescription>
          Preencha as informações da fatura ou utilize um dos métodos de captura
          automática.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={captureMethod}
          onValueChange={setCaptureMethod}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="scan">Escanear</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditor">Credor</Label>
                <Input
                  id="creditor"
                  placeholder="Nome do credor"
                  value={formData.creditor}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  placeholder="R$ 0,00"
                  type="number"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate || "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="credit_card">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição da fatura"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="barcode">
                  Código de Barras / PIX (opcional)
                </Label>
                <Input
                  id="barcode"
                  placeholder="Insira o código"
                  value={formData.barcode || formData.pixCode || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Tabs defaultValue="barcode" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="barcode">Código de Barras</TabsTrigger>
                  <TabsTrigger value="qrcode">QR Code PIX</TabsTrigger>
                </TabsList>

                <TabsContent value="barcode" className="pt-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-muted rounded-lg p-4 w-full max-w-md aspect-video flex items-center justify-center">
                      <BarcodeScanner />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Posicione o código de barras do boleto dentro da área de
                      captura.
                    </p>
                    <ScannerController
                      type="barcode"
                      onScanComplete={handleScanComplete}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="qrcode" className="pt-4">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-muted rounded-lg p-4 w-full max-w-md aspect-video flex items-center justify-center">
                      <QrCodeScanner />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Posicione o QR Code PIX dentro da área de captura.
                    </p>
                    <ScannerController
                      type="qrcode"
                      onScanComplete={handleScanComplete}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <WhatsAppImport onImportComplete={handleImportComplete} />
              <GmailImport onImportComplete={handleImportComplete} />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <FileUpload onUploadComplete={handleScanComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Cancelar
        </Button>
        <Button onClick={handleSaveInvoice}>Salvar Fatura</Button>
      </CardFooter>
    </Card>
  );
}
