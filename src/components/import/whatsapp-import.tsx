"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Loader2, Check, Search, Phone } from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface WhatsAppImportProps {
  onImportComplete?: (invoices: Partial<Invoice>[]) => void;
}

interface WhatsAppMessage {
  id: string;
  sender: string;
  timestamp: string;
  content: string;
  hasInvoice: boolean;
  invoiceData?: Partial<Invoice>;
}

export function WhatsAppImport({ onImportComplete }: WhatsAppImportProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [invoices, setInvoices] = useState<Partial<Invoice>[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Simular o processo de conexão com WhatsApp Web
  useEffect(() => {
    if (connectionStep === 1) {
      // Gerar QR code para conexão
      setQrCodeUrl("https://api.dicebear.com/7.x/identicon/svg?seed=whatsapp-qr");
      
      // Simular escaneamento do QR code após 5 segundos
      const timer = setTimeout(() => {
        setConnectionStep(2);
        scanMessages();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [connectionStep]);

  const connectWhatsApp = () => {
    setIsConnecting(true);
    setConnectionStep(1); // Mostrar QR code
    
    toast({
      title: "Iniciando conexão",
      description: "Escaneie o QR code com seu WhatsApp para conectar.",
    });
  };

  const scanMessages = () => {
    setIsScanning(true);
    setIsLoading(true);
    
    // Simular escaneamento de mensagens
    setTimeout(() => {
      // Mensagens simuladas do WhatsApp
      const mockMessages: WhatsAppMessage[] = [
        {
          id: "msg-1",
          sender: "Claro",
          timestamp: "10/06/2023 14:30",
          content: "Olá! Sua fatura da Claro está disponível. Valor: R$ 119,90. Vencimento: 10/06/2023.",
          hasInvoice: true,
          invoiceData: {
            id: "whatsapp-1",
            creditor: "Claro",
            description: "Internet Fibra 300MB - Junho/2023",
            amount: 119.9,
            dueDate: "10/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          }
        },
        {
          id: "msg-2",
          sender: "Escola Criativa",
          timestamp: "05/06/2023 09:15",
          content: "Prezado responsável, a mensalidade de junho já está disponível para pagamento. Valor: R$ 1.250,00. Vencimento: 15/06/2023.",
          hasInvoice: true,
          invoiceData: {
            id: "whatsapp-2",
            creditor: "Escola Criativa",
            description: "Mensalidade escolar - Junho/2023",
            amount: 1250.0,
            dueDate: "15/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          }
        },
        {
          id: "msg-3",
          sender: "Academia Corpo em Forma",
          timestamp: "02/06/2023 18:45",
          content: "Olá! Sua mensalidade da academia está disponível para pagamento via PIX. Valor: R$ 99,90. Vencimento: 10/06/2023.",
          hasInvoice: true,
          invoiceData: {
            id: "whatsapp-3",
            creditor: "Academia Corpo em Forma",
            description: "Mensalidade - Junho/2023",
            amount: 99.9,
            dueDate: "10/06/2023",
            paymentMethod: "pix",
            pixCode: "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142a1dd1d55520400005303986540510.005802BR5913Academia6008Sao Paulo62070503***6304D32A",
          }
        },
        {
          id: "msg-4",
          sender: "João",
          timestamp: "08/06/2023 20:12",
          content: "E aí, vamos marcar aquele futebol no sábado?",
          hasInvoice: false
        },
        {
          id: "msg-5",
          sender: "Maria",
          timestamp: "07/06/2023 15:30",
          content: "Não esqueça da reunião amanhã às 10h!",
          hasInvoice: false
        }
      ];
      
      setMessages(mockMessages);
      
      // Filtrar apenas mensagens com faturas
      const extractedInvoices = mockMessages
        .filter(msg => msg.hasInvoice && msg.invoiceData)
        .map(msg => msg.invoiceData as Partial<Invoice>);
      
      setInvoices(extractedInvoices);
      setIsLoading(false);
      setIsScanning(false);
      setIsConnected(true);
      
      toast({
        title: "WhatsApp conectado",
        description: `${extractedInvoices.length} faturas encontradas nas suas conversas.`,
      });
    }, 3000);
  };

  const toggleInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const importSelected = () => {
    const selected = invoices.filter(
      (inv) => inv.id && selectedInvoices.includes(inv.id),
    );

    if (onImportComplete) {
      onImportComplete(selected);
    }

    toast({
      title: "Importação concluída",
      description: `${selected.length} faturas importadas com sucesso.`,
    });

    // Reset state
    setIsConnected(false);
    setInvoices([]);
    setSelectedInvoices([]);
    setConnectionStep(0);
    setMessages([]);
    setPhoneNumber("");
    setVerificationCode("");
    setQrCodeUrl("");
  };

  // Renderizar etapa de conexão inicial
  if (connectionStep === 0) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <MessageSquare className="h-12 w-12 text-primary/60" />
        <div className="text-center">
          <h3 className="font-medium text-lg">Importar do WhatsApp</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte sua conta do WhatsApp para importar faturas recebidas por
            mensagem.
          </p>
        </div>
        <Button
          className="mt-2"
          onClick={connectWhatsApp}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...
            </>
          ) : (
            "Conectar WhatsApp"
          )}
        </Button>
      </div>
    );
  }

  // Renderizar etapa de escaneamento de QR code
  if (connectionStep === 1) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-lg">Escaneie o QR Code</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Abra o WhatsApp no seu celular, vá em Configurações > Dispositivos conectados > Conectar um dispositivo
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <div className="w-48 h-48 relative">
            <img 
              src={qrCodeUrl} 
              alt="WhatsApp QR Code" 
              className="w-full h-full" 
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Aguardando escaneamento...
        </p>
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
          <span className="text-sm">Conectando ao WhatsApp Web</span>
        </div>
      </div>
    );
  }

  // Renderizar etapa de escaneamento de mensagens
  if (connectionStep === 2 && isScanning) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-lg">Analisando mensagens</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Estamos escaneando suas conversas para encontrar faturas e boletos.
          </p>
        </div>
        
        <div className="w-full max-w-md bg-muted rounded-full h-2.5 mt-4">
          <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <Search className="h-5 w-5 text-primary mr-2 animate-pulse" />
          <span className="text-sm">Procurando por faturas...</span>
        </div>
      </div>
    );
  }

  // Renderizar lista de faturas encontradas
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Faturas encontradas no WhatsApp</h3>
        <Button
          size="sm"
          onClick={importSelected}
          disabled={selectedInvoices.length === 0}
        >
          Importar Selecionadas ({selectedInvoices.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={`invoice-${invoice.id}`}
                    checked={selectedInvoices.includes(invoice.id || "")}
                    onCheckedChange={() => toggleInvoice(invoice.id || "")}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{invoice.creditor}</h4>
                      <p className="font-bold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(invoice.amount || 0)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm">Vencimento: {invoice.dueDate}</p>
                      <p className="text-sm">
                        {invoice.paymentMethod === "boleto" ? "Boleto" : "PIX"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
