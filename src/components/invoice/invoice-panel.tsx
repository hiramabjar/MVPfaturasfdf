"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Grid,
  List,
  Search,
  ArrowUp,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { InvoiceList } from "./invoice-list";
import { InvoiceGrid } from "./invoice-grid";
import { InvoiceFilters } from "./invoice-filters";
import { Invoice, mockInvoices } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";

interface InvoicePanelProps {
  invoices?: Invoice[];
  setInvoices?: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export function InvoicePanel({
  invoices = mockInvoices,
  setInvoices,
}: InvoicePanelProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const [filterCriteria, setFilterCriteria] = useState({
    creditor: "",
    minAmount: "",
    maxAmount: "",
    dueDate: null as Date | null,
    status: "all",
  });

  // Detectar scroll para mostrar botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtrar faturas com base na pesquisa e filtros
  useEffect(() => {
    // Check URL parameters for filters
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get("filter");
      const tabParam = urlParams.get("tab");

      if (
        tabParam &&
        (tabParam === "all" ||
          tabParam === "pending" ||
          tabParam === "paid" ||
          tabParam === "overdue")
      ) {
        setActiveTab(tabParam);
      }

      if (filterParam === "today") {
        const today = new Date().toLocaleDateString("pt-BR");
        setFilterCriteria((prev) => ({ ...prev, dueDate: new Date() }));
        setShowFilters(true);
      } else if (filterParam === "upcoming") {
        // Filter for upcoming invoices (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        // We'll handle this in the filter logic below
        setShowFilters(true);
      }
    }

    let result = [...invoices];

    // Filtrar por status da tab
    if (activeTab !== "all") {
      result = result.filter((invoice) => invoice.status === activeTab);
    }

    // Filtrar por termo de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (invoice) =>
          invoice.creditor.toLowerCase().includes(query) ||
          invoice.description.toLowerCase().includes(query),
      );
    }

    // Aplicar filtros avançados
    if (showFilters) {
      // Filtrar por credor
      if (filterCriteria.creditor) {
        result = result.filter((invoice) =>
          invoice.creditor
            .toLowerCase()
            .includes(filterCriteria.creditor.toLowerCase()),
        );
      }

      // Filtrar por valor mínimo
      if (filterCriteria.minAmount) {
        const minAmount = parseFloat(filterCriteria.minAmount);
        result = result.filter((invoice) => invoice.amount >= minAmount);
      }

      // Filtrar por valor máximo
      if (filterCriteria.maxAmount) {
        const maxAmount = parseFloat(filterCriteria.maxAmount);
        result = result.filter((invoice) => invoice.amount <= maxAmount);
      }

      // Filtrar por data de vencimento
      if (filterCriteria.dueDate) {
        const targetDate = filterCriteria.dueDate.toLocaleDateString("pt-BR");
        result = result.filter((invoice) => invoice.dueDate === targetDate);
      }

      // Filtrar por status (se não for "all" e diferente da tab atual)
      if (
        filterCriteria.status !== "all" &&
        filterCriteria.status !== activeTab
      ) {
        result = result.filter(
          (invoice) => invoice.status === filterCriteria.status,
        );
      }
    }

    setFilteredInvoices(result);
  }, [invoices, searchQuery, activeTab, showFilters, filterCriteria]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (criteria: Partial<typeof filterCriteria>) => {
    setFilterCriteria((prev) => ({ ...prev, ...criteria }));
  };

  const clearFilters = () => {
    setFilterCriteria({
      creditor: "",
      minAmount: "",
      maxAmount: "",
      dueDate: null,
      status: "all",
    });
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  const applyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: "Os filtros foram aplicados com sucesso.",
    });
  };

  const handleStatusChange = (status: string) => {
    if (status === "pending" || status === "paid" || status === "overdue") {
      return status;
    }
    return "all";
  };

  const handleInvoiceAction = (action: string, invoiceId: string) => {
    if (!setInvoices) return;

    if (action === "delete") {
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      toast({
        title: "Fatura removida",
        description: "A fatura foi removida com sucesso.",
      });
    } else if (action === "markAsPaid") {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "paid" } : inv,
        ),
      );
      toast({
        title: "Fatura paga",
        description: "A fatura foi marcada como paga.",
      });
    } else if (action === "edit") {
      // Aqui seria redirecionado para a página de edição
      toast({
        title: "Editar fatura",
        description: "Funcionalidade de edição será implementada em breve.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar - Material Design Style */}
      <Card className="shadow-sm border rounded-xl overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar faturas..."
                className="pl-8 h-9 rounded-full border-none bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`rounded-md h-8 px-3 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
            >
              <List className="h-4 w-4 mr-1" /> Lista
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`rounded-md h-8 px-3 ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
            >
              <Grid className="h-4 w-4 mr-1" /> Cards
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 h-10 p-1 bg-secondary/30 rounded-lg">
            <TabsTrigger value="all" className="rounded-md text-xs">
              Todas
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-md text-xs">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="paid" className="rounded-md text-xs">
              Pagas
            </TabsTrigger>
            <TabsTrigger value="overdue" className="rounded-md text-xs">
              Vencidas
            </TabsTrigger>
          </TabsList>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3">
              <InvoiceFilters
                criteria={filterCriteria}
                onChange={handleFilterChange}
                onClear={clearFilters}
                onApply={applyFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* Tab Contents */}
          <TabsContent value="all" className="mt-3 space-y-4">
            {viewMode === "list" ? (
              <InvoiceList
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            ) : (
              <InvoiceGrid
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            )}
          </TabsContent>
          <TabsContent value="pending" className="mt-3 space-y-4">
            {viewMode === "list" ? (
              <InvoiceList
                status="pending"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            ) : (
              <InvoiceGrid
                status="pending"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            )}
          </TabsContent>
          <TabsContent value="paid" className="mt-3 space-y-4">
            {viewMode === "list" ? (
              <InvoiceList
                status="paid"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            ) : (
              <InvoiceGrid
                status="paid"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            )}
          </TabsContent>
          <TabsContent value="overdue" className="mt-3 space-y-4">
            {viewMode === "list" ? (
              <InvoiceList
                status="overdue"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            ) : (
              <InvoiceGrid
                status="overdue"
                invoices={filteredInvoices}
                onAction={handleInvoiceAction}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Results Count */}
      <div className="text-xs text-muted-foreground text-center mt-2">
        Mostrando {filteredInvoices.length} de {invoices.length} faturas
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button
            size="icon"
            className="rounded-full shadow-lg h-10 w-10"
            variant="secondary"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
