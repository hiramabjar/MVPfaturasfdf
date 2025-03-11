import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between py-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">Painel de Faturas</h1>
        <p className="text-muted-foreground">
          Gerencie suas faturas em um só lugar
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Button asChild>
          <Link href="/dashboard/add-invoice">
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Link>
        </Button>
      </div>
    </header>
  );
}
