"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [averageAmount, setAverageAmount] = useState(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    // Calculate total and average
    const total = mockInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    setTotalAmount(total);
    setAverageAmount(total / mockInvoices.length);

    // Group by month
    const monthlyTotals: Record<string, number> = {};
    mockInvoices.forEach((invoice) => {
      const dateParts = invoice.dueDate.split("/");
      const monthYear = `${dateParts[1]}/${dateParts[2]}`; // MM/YYYY
      monthlyTotals[monthYear] =
        (monthlyTotals[monthYear] || 0) + invoice.amount;
    });

    const monthlyDataArray = Object.entries(monthlyTotals).map(
      ([month, amount]) => ({
        month,
        amount,
      }),
    );
    setMonthlyData(monthlyDataArray);

    // Group by status
    const statusCounts: Record<string, number> = {
      pending: 0,
      paid: 0,
      overdue: 0,
    };

    mockInvoices.forEach((invoice) => {
      statusCounts[invoice.status] += invoice.amount;
    });

    const statusDataArray = [
      { name: "Pendente", value: statusCounts.pending },
      { name: "Pago", value: statusCounts.paid },
      { name: "Vencido", value: statusCounts.overdue },
    ];
    setStatusData(statusDataArray);
  }, []);

  return (
    <div className="bg-background min-h-screen max-w-md mx-auto overflow-hidden pb-16">
      <DashboardHeader />

      <div className="px-4 py-4 space-y-6">
        <h1 className="text-xl font-bold">Análise Financeira</h1>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Média</p>
              <p className="text-xl font-bold">
                {formatCurrency(averageAmount)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gastos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
