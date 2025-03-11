"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Filter, Grid, List, Search } from "lucide-react";
import { useState } from "react";
import { InvoiceList } from "./invoice-list";
import { InvoiceGrid } from "./invoice-grid";
import { InvoiceFilters } from "./invoice-filters";

export function InvoicePanel() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Gerenciamento de Faturas</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={
                showFilters ? "bg-primary text-primary-foreground" : ""
              }
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar faturas..." className="pl-8" />
            </div>
            <div className="w-full sm:w-auto">
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="paid">Pagas</TabsTrigger>
                  <TabsTrigger value="overdue">Vencidas</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4 space-y-4">
                  {viewMode === "list" ? <InvoiceList /> : <InvoiceGrid />}
                </TabsContent>
                <TabsContent value="pending" className="mt-4 space-y-4">
                  {viewMode === "list" ? (
                    <InvoiceList status="pending" />
                  ) : (
                    <InvoiceGrid status="pending" />
                  )}
                </TabsContent>
                <TabsContent value="paid" className="mt-4 space-y-4">
                  {viewMode === "list" ? (
                    <InvoiceList status="paid" />
                  ) : (
                    <InvoiceGrid status="paid" />
                  )}
                </TabsContent>
                <TabsContent value="overdue" className="mt-4 space-y-4">
                  {viewMode === "list" ? (
                    <InvoiceList status="overdue" />
                  ) : (
                    <InvoiceGrid status="overdue" />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {showFilters && <InvoiceFilters />}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 10 de 24 faturas
        </div>
        <Button variant="outline" size="sm">
          Ver mais
        </Button>
      </CardFooter>
    </Card>
  );
}
