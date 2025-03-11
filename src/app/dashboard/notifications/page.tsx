"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Fatura próxima do vencimento",
      message: "A fatura da Claro vence em 2 dias. Valor: R$ 119,90.",
      type: "warning",
      date: "Hoje, 10:30",
      read: false,
    },
    {
      id: "2",
      title: "Fatura vencida",
      message: "A fatura do Condomínio Edifício Aurora está vencida há 2 dias.",
      type: "error",
      date: "Ontem, 15:45",
      read: false,
    },
    {
      id: "3",
      title: "Fatura paga com sucesso",
      message: "Sua fatura da Sabesp foi paga com sucesso.",
      type: "success",
      date: "Ontem, 09:15",
      read: true,
    },
    {
      id: "4",
      title: "Nova fatura disponível",
      message: "Uma nova fatura da Escola Criativa foi adicionada.",
      type: "info",
      date: "12/06/2023, 14:20",
      read: true,
    },
    {
      id: "5",
      title: "Lembrete de pagamento",
      message:
        "Não esqueça de pagar a fatura do Plano de Saúde Vida que vence hoje.",
      type: "warning",
      date: "Hoje, 08:00",
      read: false,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-background min-h-screen max-w-md mx-auto overflow-hidden pb-16">
      <DashboardHeader />

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">Nenhuma notificação</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Você não tem notificações no momento
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`overflow-hidden ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-medium ${!notification.read ? "text-primary" : ""}`}
                        >
                          {notification.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1 -mr-1"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.date}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marcar como lida
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
