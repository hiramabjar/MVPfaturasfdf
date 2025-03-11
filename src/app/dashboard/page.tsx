"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { InvoicePanel } from "@/components/invoice/invoice-panel";
import { useEffect, useState } from "react";
import { Invoice, mockInvoices } from "@/lib/mock-data";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatsCarousel } from "@/components/dashboard/stats-carousel";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    overdue: 0,
    paid: 0,
    dueSoon: 0,
    dueToday: 0,
  });

  useEffect(() => {
    // Calcular estatísticas
    const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const pending = invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Calcular faturas que vencem hoje
    const today = new Date();
    const todayFormatted = today.toLocaleDateString("pt-BR");
    const dueToday = invoices.filter(
      (inv) => inv.status === "pending" && inv.dueDate === todayFormatted,
    ).length;

    // Calcular faturas que vencem em até 3 dias
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const dueSoon = invoices.filter((inv) => {
      if (inv.status !== "pending") return false;
      const parts = inv.dueDate.split("/");
      const dueDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0]),
      );
      return dueDate > today && dueDate <= threeDaysFromNow;
    }).length;

    setStats({
      total,
      pending,
      overdue,
      paid,
      dueSoon,
      dueToday,
    });
  }, [invoices]);

  return (
    <div className="bg-background min-h-screen max-w-md mx-auto overflow-hidden pb-16">
      <DashboardHeader />
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner invoices={invoices} />

        {/* Stats Carousel */}
        <div>
          <h2 className="text-sm font-medium mb-2">Resumo Financeiro</h2>
          <StatsCarousel stats={stats} invoices={invoices} />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-medium mb-2">Ações Rápidas</h2>
          <QuickActions />
        </div>

        {/* Invoice Panel */}
        <div>
          <h2 className="text-sm font-medium mb-2">Suas Faturas</h2>
          <InvoicePanel invoices={invoices} setInvoices={setInvoices} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
