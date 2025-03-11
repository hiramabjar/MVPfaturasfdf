import { AddInvoiceForm } from "@/components/invoice/add-invoice-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddInvoicePage() {
  return (
    <div className="container mx-auto py-4 md:py-6 px-4 bg-background min-h-screen">
      <div className="flex items-center mb-4 md:mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mr-2 md:mr-4 p-0 md:p-2"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />{" "}
            <span className="hidden md:inline">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold">Adicionar Nova Fatura</h1>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <AddInvoiceForm />
      </div>

      {/* Botão fixo para mobile */}
      <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden">
        <Button
          variant="default"
          size="lg"
          className="w-full shadow-lg"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar e Voltar
          </Link>
        </Button>
      </div>
    </div>
  );
}
