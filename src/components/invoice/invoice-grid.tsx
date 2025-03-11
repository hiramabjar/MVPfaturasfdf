import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import { Calendar, Edit, MoreHorizontal, Trash } from "lucide-react";
import { mockInvoices } from "@/lib/mock-data";

interface InvoiceGridProps {
  status?: "pending" | "paid" | "overdue";
}

export function InvoiceGrid({ status }: InvoiceGridProps) {
  const filteredInvoices = status
    ? mockInvoices.filter((invoice) => invoice.status === status)
    : mockInvoices;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredInvoices.map((invoice) => (
        <Card key={invoice.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
            <div>
              <h3 className="font-semibold">{invoice.creditor}</h3>
              <p className="text-sm text-muted-foreground">
                {invoice.description}
              </p>
            </div>
            <Badge variant="outline" className={getStatusColor(invoice.status)}>
              {invoice.status === "pending" && "Pendente"}
              {invoice.status === "paid" && "Pago"}
              {invoice.status === "overdue" && "Vencido"}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{invoice.dueDate}</span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
