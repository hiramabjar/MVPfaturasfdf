import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import {
  Edit,
  MoreHorizontal,
  Trash,
  Calendar,
  CreditCard,
  Receipt,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Invoice, mockInvoices } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface InvoiceListProps {
  status?: "pending" | "paid" | "overdue";
  invoices?: Invoice[];
  onAction?: (action: string, invoiceId: string) => void;
}

export function InvoiceList({
  status,
  invoices = mockInvoices,
  onAction,
}: InvoiceListProps) {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

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

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices((prev) => [...prev, invoiceId]);
    } else {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id));
    } else {
      setSelectedInvoices([]);
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

  // Android Material Design Cards
  const AndroidInvoiceList = () => (
    <div className="space-y-3">
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
          <DollarSign className="h-12 w-12 text-muted-foreground/30 mb-2" />
          <p>Nenhuma fatura encontrada.</p>
        </div>
      ) : (
        filteredInvoices.map((invoice) => (
          <Card
            key={invoice.id}
            className={`overflow-hidden border-0 shadow-sm rounded-lg ${getStatusBgColor(invoice.status)}`}
          >
            <CardContent className="p-0">
              {/* Card Header */}
              <div className="p-3 flex justify-between items-center border-b border-border/10">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`mobile-check-${invoice.id}`}
                    className="rounded-full"
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) =>
                      handleSelectInvoice(invoice.id, checked === true)
                    }
                  />
                  <div>
                    <h3 className="font-medium text-sm">{invoice.creditor}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {invoice.dueDate}
                      </span>
                    </div>
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
              </div>

              {/* Card Content */}
              <div className="p-3">
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {invoice.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    {getPaymentIcon(invoice.paymentMethod)}
                    <span className="text-xs capitalize">
                      {invoice.paymentMethod === "credit_card"
                        ? "Cartão"
                        : invoice.paymentMethod === "boleto"
                          ? "Boleto"
                          : invoice.paymentMethod === "pix"
                            ? "PIX"
                            : "Outro"}
                    </span>
                  </div>
                  <p className="text-base font-bold">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-end border-t border-border/10 bg-background/50">
                {invoice.status !== "paid" && (
                  <Button
                    variant="ghost"
                    className="h-10 rounded-none flex-1 text-xs text-green-600 dark:text-green-400"
                    onClick={() => handleAction("markAsPaid", invoice.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Pagar
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="h-10 rounded-none flex-1 text-xs"
                  onClick={() => handleAction("edit", invoice.id)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  className="h-10 rounded-none flex-1 text-xs text-red-600 dark:text-red-400"
                  onClick={() => handleAction("delete", invoice.id)}
                >
                  <Trash className="h-3.5 w-3.5 mr-1" /> Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  // Versão desktop (tabela) - mantida para compatibilidade, mas não usada no Android
  const DesktopInvoiceList = () => (
    <div className="rounded-md border hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  filteredInvoices.length > 0 &&
                  selectedInvoices.length === filteredInvoices.length
                }
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
              />
            </TableHead>
            <TableHead>Credor</TableHead>
            <TableHead className="hidden lg:table-cell">Descrição</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                Nenhuma fatura encontrada.
              </TableCell>
            </TableRow>
          ) : (
            filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) =>
                      handleSelectInvoice(invoice.id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {invoice.creditor}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {invoice.description}
                </TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(invoice.status)}
                  >
                    {invoice.status === "pending" && "Pendente"}
                    {invoice.status === "paid" && "Pago"}
                    {invoice.status === "overdue" && "Vencido"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {invoice.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction("markAsPaid", invoice.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction("edit", invoice.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction("delete", invoice.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleAction("edit", invoice.id)}
                        >
                          Editar
                        </DropdownMenuItem>
                        {invoice.status !== "paid" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("markAsPaid", invoice.id)
                            }
                          >
                            Marcar como pago
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleAction("delete", invoice.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return <AndroidInvoiceList />;
}
