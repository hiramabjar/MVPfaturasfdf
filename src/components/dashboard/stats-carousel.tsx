"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowUp,
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Invoice } from "@/lib/mock-data";
import { useRef, useEffect, useState } from "react";

interface StatsCarouselProps {
  stats: {
    pending: number;
    overdue: number;
    paid: number;
    dueToday: number;
    dueSoon: number;
  };
  invoices: Invoice[];
}

export function StatsCarousel({ stats, invoices }: StatsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = 5;

  // Auto scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update scroll position when activeIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount =
        activeIndex * (carouselRef.current.scrollWidth / totalItems);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        <Card className="flex-shrink-0 w-full snap-center bg-card overflow-hidden border-l-4 border-l-amber-500">
          <CardContent className="p-3 flex flex-col">
            <span className="text-xs text-muted-foreground">Pendente</span>
            <span className="text-lg font-bold">
              {formatCurrency(stats.pending)}
            </span>
            <div className="flex items-center mt-1 text-xs text-amber-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {invoices.filter((inv) => inv.status === "pending").length}{" "}
                faturas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-shrink-0 w-full snap-center bg-card overflow-hidden border-l-4 border-l-red-500">
          <CardContent className="p-3 flex flex-col">
            <span className="text-xs text-muted-foreground">Vencido</span>
            <span className="text-lg font-bold">
              {formatCurrency(stats.overdue)}
            </span>
            <div className="flex items-center mt-1 text-xs text-red-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>
                {invoices.filter((inv) => inv.status === "overdue").length}{" "}
                faturas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-shrink-0 w-full snap-center bg-card overflow-hidden border-l-4 border-l-green-500">
          <CardContent className="p-3 flex flex-col">
            <span className="text-xs text-muted-foreground">Pago</span>
            <span className="text-lg font-bold">
              {formatCurrency(stats.paid)}
            </span>
            <div className="flex items-center mt-1 text-xs text-green-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>
                {invoices.filter((inv) => inv.status === "paid").length} faturas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-shrink-0 w-full snap-center bg-card overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-3 flex flex-col">
            <span className="text-xs text-muted-foreground">Vence hoje</span>
            <span className="text-lg font-bold">{stats.dueToday}</span>
            <div className="flex items-center mt-1 text-xs text-blue-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Ação urgente</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-shrink-0 w-full snap-center bg-card overflow-hidden border-l-4 border-l-purple-500">
          <CardContent className="p-3 flex flex-col">
            <span className="text-xs text-muted-foreground">Próximos dias</span>
            <span className="text-lg font-bold">{stats.dueSoon}</span>
            <div className="flex items-center mt-1 text-xs text-purple-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Planejamento</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-2 gap-1">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${index === activeIndex ? "w-4 bg-primary" : "w-2 bg-muted"}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
