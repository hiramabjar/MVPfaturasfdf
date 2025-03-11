import { AddInvoiceForm } from "@/components/invoice/add-invoice-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddInvoicePage() {
  return (
    <div className="container mx-auto py-6 bg-background min-h-screen">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Adicionar Nova Fatura</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <AddInvoiceForm />
      </div>
    </div>
  );
}
