"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Loader2, Search, FileText, Download } from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface GmailImportProps {
  onImportComplete?: (invoices: Partial<Invoice>[]) => void;
}

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  hasAttachment: boolean;
  preview: string;
  invoiceData?: Partial<Invoice>;
}

export function GmailImport({ onImportComplete }: GmailImportProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [invoices, setInvoices] = useState<Partial<Invoice>[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  // Simular progresso de escaneamento
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isScanning) {
      progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setIsScanning(false);
            setIsLoading(false);
            setIsConnected(true);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isScanning]);

  const connectGmail = () => {
    if (!email || !validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    // Simular autenticação
    setTimeout(() => {
      setIsConnecting(false);
      setIsScanning(true);
      setIsLoading(true);
      setScanProgress(0);
      scanEmails();
    }, 2000);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const scanEmails = () => {
    // Simular escaneamento de emails
    setTimeout(() => {
      // Emails simulados
      const mockEmails: EmailMessage[] = [
        {
          id: "email-1",
          from: "fatura@nubank.com.br",
          subject: "Sua fatura Nubank de junho está disponível",
          date: "01/06/2023",
          hasAttachment: true,
          preview:
            "Olá, sua fatura do cartão Nubank de junho já está disponível para pagamento. Valor: R$ 2.345,67. Vencimento: 10/06/2023.",
          invoiceData: {
            id: "gmail-1",
            creditor: "Cartão Nubank",
            description: "Fatura - Junho/2023",
            amount: 2345.67,
            dueDate: "10/06/2023",
            paymentMethod: "credit_card",
          },
        },
        {
          id: "email-2",
          from: "atendimento@planosaude.com.br",
          subject: "Fatura Plano de Saúde Vida - Junho/2023",
          date: "03/06/2023",
          hasAttachment: true,
          preview:
            "Prezado cliente, sua fatura do Plano de Saúde Vida referente a junho/2023 já está disponível. Valor: R$ 789,90. Vencimento: 20/06/2023.",
          invoiceData: {
            id: "gmail-2",
            creditor: "Plano de Saúde Vida",
            description: "Plano familiar - Junho/2023",
            amount: 789.9,
            dueDate: "20/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
        },
        {
          id: "email-3",
          from: "prefeitura@cidade.gov.br",
          subject: "IPTU 2023 - Parcela 6",
          date: "05/06/2023",
          hasAttachment: true,
          preview:
            "Informamos que a parcela 6/10 do seu IPTU 2023 já está disponível para pagamento. Valor: R$ 213,45. Vencimento: 15/06/2023.",
          invoiceData: {
            id: "gmail-3",
            creditor: "IPTU 2023",
            description: "Parcela 6/10",
            amount: 213.45,
            dueDate: "15/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
        },
        {
          id: "email-4",
          from: "seguro@seguradora.com.br",
          subject: "Fatura Seguro Auto - Parcela 4/12",
          date: "07/06/2023",
          hasAttachment: true,
          preview:
            "Prezado cliente, a parcela 4/12 do seu seguro auto já está disponível para pagamento. Valor: R$ 189,90. Vencimento: 25/06/2023.",
          invoiceData: {
            id: "gmail-4",
            creditor: "Seguro Auto",
            description: "Parcela 4/12 - Honda Civic",
            amount: 189.9,
            dueDate: "25/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
        },
        {
          id: "email-5",
          from: "newsletter@empresa.com.br",
          subject: "Novidades da semana",
          date: "08/06/2023",
          hasAttachment: false,
          preview:
            "Confira as novidades e promoções desta semana em nossa loja!",
        },
        {
          id: "email-6",
          from: "contato@site.com.br",
          subject: "Confirmação de cadastro",
          date: "02/06/2023",
          hasAttachment: false,
          preview: "Seu cadastro foi realizado com sucesso em nosso site.",
        },
      ];

      setEmails(mockEmails);

      // Filtrar apenas emails com faturas
      const extractedInvoices = mockEmails
        .filter((email) => email.invoiceData)
        .map((email) => email.invoiceData as Partial<Invoice>);

      setInvoices(extractedInvoices);

      toast({
        title: "Gmail conectado",
        description: `${extractedInvoices.length} faturas encontradas nos seus emails.`,
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
    setEmail("");
    setPassword("");
  };

  // Renderizar formulário de login
  if (!isConnected && !isScanning) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <Mail className="h-12 w-12 text-primary/60" />
        <div className="text-center">
          <h3 className="font-medium text-lg">Importar do Gmail</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte sua conta do Gmail para importar faturas recebidas por
            email.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={connectGmail}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...
              </>
            ) : (
              "Conectar Gmail"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Renderizar progresso de escaneamento
  if (isScanning) {
    return (
      <div className="bg-muted/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-lg">Analisando emails</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Estamos escaneando sua caixa de entrada para encontrar faturas e
            boletos.
          </p>
        </div>

        <div className="w-full max-w-md bg-muted rounded-full h-2.5 mt-4">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${scanProgress}%` }}
          ></div>
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
        <h3 className="font-medium">Faturas encontradas no Gmail</h3>
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
                        {invoice.paymentMethod === "boleto"
                          ? "Boleto"
                          : invoice.paymentMethod === "pix"
                            ? "PIX"
                            : invoice.paymentMethod === "credit_card"
                              ? "Cartão de Crédito"
                              : "Outro"}
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
