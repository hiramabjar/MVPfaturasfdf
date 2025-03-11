"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Edit,
  LogOut,
  Moon,
  Sun,
  User,
  Bell,
  Lock,
  HelpCircle,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "Usuário",
    email: "usuario@email.com",
    phone: "(11) 98765-4321",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const saveProfile = () => {
    // Aqui seria implementada a lógica para salvar os dados do perfil
    setEditMode(false);
  };

  return (
    <div className="bg-background min-h-screen max-w-md mx-auto overflow-hidden pb-16">
      <DashboardHeader />

      <div className="px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Perfil</h1>
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => (editMode ? saveProfile() : setEditMode(true))}
          >
            {editMode ? "Salvar" : "Editar"}
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {editMode && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mt-4 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Configurações</h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Notificações</span>
                  </div>
                  <Switch
                    defaultChecked
                    onClick={() =>
                      toast({
                        title: "Notificações",
                        description:
                          "Configurações de notificações atualizadas.",
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-primary" />
                    <span>Tema Escuro</span>
                  </div>
                  <Switch
                    onClick={() =>
                      toast({
                        title: "Tema",
                        description: "Configurações de tema atualizadas.",
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <span>Autenticação Biométrica</span>
                  </div>
                  <Switch
                    onClick={() =>
                      toast({
                        title: "Autenticação",
                        description:
                          "Configurações de autenticação atualizadas.",
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
