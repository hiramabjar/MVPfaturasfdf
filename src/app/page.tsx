"use client";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  ArrowRight,
  FileText,
  QrCode,
  Scan,
  Upload,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const [stats, setStats] = useState({
    pendingAmount: 0,
    pendingCount: 0,
    dueTodayCount: 0,
  });

  useEffect(() => {
    // Calcular estatísticas para exibição na prévia do app
    const pendingInvoices = mockInvoices.filter(
      (inv) => inv.status === "pending",
    );
    const pendingAmount = pendingInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0,
    );
    const pendingCount = pendingInvoices.length;

    // Calcular faturas que vencem hoje
    const today = new Date().toLocaleDateString("pt-BR");
    const dueTodayCount = pendingInvoices.filter(
      (inv) => inv.dueDate === today,
    ).length;

    setStats({
      pendingAmount,
      pendingCount,
      dueTodayCount: dueTodayCount || 3, // Fallback para 3 se não houver faturas para hoje
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">
          Gerenciador de Faturas
        </h1>
        <ThemeSwitcher />
      </header>

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">
            Organize suas faturas em um só lugar
          </h2>
          <p className="text-base md:text-xl text-muted-foreground">
            Capture, organize e gerencie todas as suas faturas bancárias de
            forma simples e eficiente.
          </p>
          <div className="flex flex-col gap-3 justify-center pt-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/dashboard">
                Acessar Painel <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/dashboard/add-invoice">
                Adicionar Fatura <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-12 md:mt-16 relative max-w-md mx-auto">
          <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-[2.5rem] border-8 border-foreground/10 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background">
              {/* Dashboard preview */}
              <div className="p-4 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold">Painel de Faturas</h3>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>

                <div className="space-y-3">
                  <div className="bg-card rounded-lg p-3 shadow-sm border border-border/40">
                    <div className="text-xs text-muted-foreground">
                      Faturas pendentes
                    </div>
                    <div className="text-lg font-bold">
                      {formatCurrency(stats.pendingAmount)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stats.pendingCount} faturas
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-3 shadow-sm border border-border/40">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Vence hoje
                        </div>
                        <div className="text-sm font-bold">
                          {stats.dueTodayCount} faturas
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 py-1"
                      >
                        <span className="text-xs">Ver</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-4">
                <div className="text-foreground text-sm font-medium">
                  Faturas pendentes
                </div>
                <div className="text-foreground text-lg font-bold">
                  {formatCurrency(stats.pendingAmount)}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-muted-foreground text-xs">
                    {stats.dueTodayCount} faturas para hoje
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2 py-1"
                    asChild
                  >
                    <Link href="/dashboard">
                      <span className="text-xs">Ver</span>
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-12 md:mt-16">
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border/40">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Scan className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Captura Automática
                </h3>
                <p className="text-sm text-muted-foreground">
                  Escaneie códigos de barras de boletos e QR codes PIX para
                  extrair automaticamente todas as informações.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-sm border border-border/40">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Importação Direta
                </h3>
                <p className="text-sm text-muted-foreground">
                  Importe faturas diretamente do WhatsApp e Gmail ou faça upload
                  de arquivos manualmente.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-5 shadow-sm border border-border/40">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Organização Inteligente
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visualize suas faturas organizadas por data de vencimento,
                  valor e credor, com alertas para vencimentos próximos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Comece a organizar suas finanças
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Experimente gratuitamente e tenha controle total das suas faturas
          </p>
          <Button className="w-full" asChild>
            <Link href="/dashboard">
              Começar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t mt-12 md:mt-24">
        <div className="container mx-auto py-6 px-4 text-center text-sm text-muted-foreground">
          © 2023 Gerenciador de Faturas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
