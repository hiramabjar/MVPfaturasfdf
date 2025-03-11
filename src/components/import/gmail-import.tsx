"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Loader2 } from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";

interface GmailImportProps {
  onImportComplete?: (invoices: Partial<Invoice>[]) => void;
}

export function GmailImport({ onImportComplete }: GmailImportProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Partial<Invoice>[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const connectGmail = () => {
    setIsConnecting(true);

    // Simulação de conexão com Gmail
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setIsLoading(true);

      // Simulação de carregamento de faturas
      setTimeout(() => {
        const mockInvoices: Partial<Invoice>[] = [
          {
            id: "gmail-1",
            creditor: "Cartão Nubank",
            description: "Fatura - Junho/2023",
            amount: 2345.67,
            dueDate: "10/06/2023",
            paymentMethod: "credit_card",
          },
          {
            id: "gmail-2",
            creditor: "Plano de Saúde Vida",
            description: "Plano familiar - Junho/2023",
            amount: 789.9,
            dueDate: "20/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
          {
            id: "gmail-3",
            creditor: "IPTU 2023",
            description: "Parcela 6/10",
            amount: 213.45,
            dueDate: "15/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
          {
            id: "gmail-4",
            creditor: "Seguro Auto",
            description: "Parcela 4/12 - Honda Civic",
            amount: 189.9,
            dueDate: "25/06/2023",
            paymentMethod: "boleto",
            barcode: "34191790010104351004791020150008291070026000",
          },
        ];

        setInvoices(mockInvoices);
        setIsLoading(false);
        toast({
          title: "Gmail conectado",
          description: `${mockInvoices.length} faturas encontradas nos seus emails.`,
        });
      }, 2000);
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
  };

  if (!isConnected) {
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
        <Button className="mt-2" onClick={connectGmail} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...
            </>
          ) : (
            "Conectar Gmail"
          )}
        </Button>
      </div>
    );
  }

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
