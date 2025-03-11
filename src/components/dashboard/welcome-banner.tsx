"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Invoice } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

interface WelcomeBannerProps {
  invoices: Invoice[];
}

export function WelcomeBanner({ invoices }: WelcomeBannerProps) {
  const [greeting, setGreeting] = useState("Olá");
  const [currentTime, setCurrentTime] = useState("");
  const [dueTodayAmount, setDueTodayAmount] = useState(0);
  const [dueTodayCount, setDueTodayCount] = useState(0);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Bom dia");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }

    // Format current time
    const now = new Date();
    setCurrentTime(
      now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );

    // Calculate due today stats
    const today = now.toLocaleDateString("pt-BR");
    const dueTodayInvoices = invoices.filter(
      (inv) => inv.status === "pending" && inv.dueDate === today,
    );

    setDueTodayCount(dueTodayInvoices.length);
    setDueTodayAmount(
      dueTodayInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    );
  }, [invoices]);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-bold">{greeting}!</h1>
        <p className="text-sm text-muted-foreground capitalize">
          {currentTime}
        </p>
      </div>

      {dueTodayCount > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-none shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Vence hoje</span>
                </div>
                <p className="text-lg font-bold mt-1">
                  {formatCurrency(dueTodayAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dueTodayCount} faturas para pagar hoje
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white dark:bg-background shadow-sm"
                onClick={() =>
                  (window.location.href = "/dashboard?filter=today")
                }
              >
                Ver <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
