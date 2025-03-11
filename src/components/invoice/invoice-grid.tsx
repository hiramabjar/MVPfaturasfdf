import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import {
  Calendar,
  Edit,
  MoreHorizontal,
  Trash,
  CreditCard,
  Receipt,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Invoice, mockInvoices } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceGridProps {
  status?: "pending" | "paid" | "overdue";
  invoices?: Invoice[];
  onAction?: (action: string, invoiceId: string) => void;
}

export function InvoiceGrid({
  status,
  invoices = mockInvoices,
  onAction,
}: InvoiceGridProps) {
  const filteredInvoices = status
    ? invoices.filter((invoice) => invoice.status === status)
    : invoices;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-3 w-3" />;
      case "boleto":
      case "pix":
      default:
        return <Receipt className="h-3 w-3" />;
    }
  };

  const handleAction = (action: string, invoiceId: string) => {
    if (onAction) {
      onAction(action, invoiceId);
    }
  };

  // Função para obter a cor de fundo baseada no status
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 dark:bg-green-950/30 border-l-4 border-l-green-500";
      case "pending":
        return "bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500";
      case "overdue":
        return "bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500";
      default:
        return "";
    }
  };

  if (filteredInvoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <DollarSign className="h-12 w-12 text-muted-foreground/30 mb-2" />
        <p>Nenhuma fatura encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {filteredInvoices.map((invoice) => (
        <Card
          key={invoice.id}
          className={`overflow-hidden border-0 shadow-sm rounded-lg ${getStatusBgColor(invoice.status)}`}
        >
          <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
            <div>
              <h3 className="font-semibold text-sm">{invoice.creditor}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {invoice.dueDate}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(invoice.status)} text-xs px-2 py-0 h-5 rounded-full`}
            >
              {invoice.status === "pending" && "Pendente"}
              {invoice.status === "paid" && "Pago"}
              {invoice.status === "overdue" && "Vencido"}
            </Badge>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <p className="text-lg font-bold">
              {formatCurrency(invoice.amount)}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {getPaymentIcon(invoice.paymentMethod)}
              <span className="text-xs capitalize text-muted-foreground">
                {invoice.paymentMethod === "credit_card"
                  ? "Cartão"
                  : invoice.paymentMethod === "boleto"
                    ? "Boleto"
                    : invoice.paymentMethod === "pix"
                      ? "PIX"
                      : "Outro"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-0 flex justify-between border-t border-border/10">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-none flex-1 text-xs"
              onClick={() => handleAction("edit", invoice.id)}
            >
              <Edit className="h-3 w-3 mr-1" /> Editar
            </Button>
            {invoice.status !== "paid" ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-none flex-1 text-xs text-green-600 dark:text-green-400"
                onClick={() => handleAction("markAsPaid", invoice.id)}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" /> Pagar
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-none flex-1 text-xs text-red-600 dark:text-red-400"
                onClick={() => handleAction("delete", invoice.id)}
              >
                <Trash className="h-3 w-3 mr-1" /> Excluir
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
