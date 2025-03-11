"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Bell,
  User,
  Search,
  BarChart3,
  Home,
  LogOut,
  Settings,
  CreditCard,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      {/* Android-style Header */}
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-lg font-bold">Gerenciador de Faturas</h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 relative"
            asChild
          >
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Material Design Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-card shadow-xl flex flex-col h-full">
            {/* User Profile Header */}
            <div className="bg-primary/10 p-6 pb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">Usuário</h3>
                  <p className="text-sm text-muted-foreground">
                    usuario@email.com
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-auto p-2">
              <div className="pt-2 pb-4">
                <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                  PRINCIPAL
                </p>
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard">
                      <Home className="mr-3 h-4 w-4" /> Início
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/analytics">
                      <BarChart3 className="mr-3 h-4 w-4" /> Análise
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/notifications">
                      <Bell className="mr-3 h-4 w-4" /> Notificações
                      <Badge className="ml-auto">3</Badge>
                    </Link>
                  </Button>
                </nav>
              </div>

              <div className="pt-2 pb-4 border-t border-border/30">
                <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                  FINANÇAS
                </p>
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/add-invoice">
                      <FileText className="mr-3 h-4 w-4" /> Faturas
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                  >
                    <CreditCard className="mr-3 h-4 w-4" /> Cartões
                  </Button>
                </nav>
              </div>

              <div className="pt-2 pb-4 border-t border-border/30">
                <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                  CONFIGURAÇÕES
                </p>
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/profile">
                      <User className="mr-3 h-4 w-4" /> Perfil
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                  >
                    <Settings className="mr-3 h-4 w-4" /> Configurações
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg"
                  >
                    <HelpCircle className="mr-3 h-4 w-4" /> Ajuda
                  </Button>
                </nav>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </div>

          {/* Close menu when clicking outside */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </header>
  );
}
