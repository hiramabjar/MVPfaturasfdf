"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  CreditCard,
  Receipt,
  QrCode,
  CalendarClock,
  BarChart2,
  AlertCircle,
  FileText,
  Wallet,
  Clock,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export function QuickActions() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Initial check
      checkMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkMobile);

      // Cleanup
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case "add-invoice":
        router.push("/dashboard/add-invoice");
        break;
      case "cards":
        toast({
          title: "Cartões",
          description: "Funcionalidade de cartões será implementada em breve.",
        });
        break;
      case "boletos":
        toast({
          title: "Boletos",
          description: "Visualização de boletos será implementada em breve.",
        });
        break;
      case "pix":
        toast({
          title: "PIX",
          description: "Funcionalidade de PIX será implementada em breve.",
        });
        break;
      case "due-today":
        router.push("/dashboard?filter=today");
        break;
      case "reports":
        router.push("/dashboard/analytics");
        break;
      case "overdue":
        router.push("/dashboard?tab=overdue");
        break;
      case "all-invoices":
        router.push("/dashboard?tab=all");
        break;
      case "wallet":
        toast({
          title: "Carteira Digital",
          description: "Funcionalidade de carteira será implementada em breve.",
        });
        break;
      case "upcoming":
        router.push("/dashboard?filter=upcoming");
        break;
      case "filter":
        toast({
          title: "Filtros Avançados",
          description:
            "Clique no ícone de filtro na barra de pesquisa para acessar filtros avançados.",
        });
        break;
      default:
        break;
    }
  };

  // Mobile view - grid of icons
  if (isMobile) {
    return (
      <div className="grid grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="icon"
          className="flex flex-col items-center justify-center h-20 p-0 gap-1 bg-primary/5"
          onClick={() => handleAction("add-invoice")}
        >
          <PlusCircle className="h-6 w-6 text-primary" />
          <span className="text-[10px]">Nova Fatura</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="flex flex-col items-center justify-center h-20 p-0 gap-1"
          onClick={() => handleAction("due-today")}
        >
          <Clock className="h-6 w-6 text-amber-500" />
          <span className="text-[10px]">Vence Hoje</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="flex flex-col items-center justify-center h-20 p-0 gap-1"
          onClick={() => handleAction("overdue")}
        >
          <AlertCircle className="h-6 w-6 text-red-500" />
          <span className="text-[10px]">Vencidas</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="flex flex-col items-center justify-center h-20 p-0 gap-1"
          onClick={() => handleAction("reports")}
        >
          <BarChart2 className="h-6 w-6 text-blue-500" />
          <span className="text-[10px]">Relatórios</span>
        </Button>
      </div>
    );
  }

  // Desktop view - horizontal scroll
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0 bg-primary/5"
          onClick={() => handleAction("add-invoice")}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Nova Fatura
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("cards")}
        >
          <CreditCard className="h-4 w-4 mr-2" /> Cartões
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("boletos")}
        >
          <Receipt className="h-4 w-4 mr-2" /> Boletos
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("pix")}
        >
          <QrCode className="h-4 w-4 mr-2" /> PIX
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("due-today")}
        >
          <CalendarClock className="h-4 w-4 mr-2" /> Vence Hoje
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("reports")}
        >
          <BarChart2 className="h-4 w-4 mr-2" /> Relatórios
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("all-invoices")}
        >
          <FileText className="h-4 w-4 mr-2" /> Todas Faturas
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0"
          onClick={() => handleAction("wallet")}
        >
          <Wallet className="h-4 w-4 mr-2" /> Carteira
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
