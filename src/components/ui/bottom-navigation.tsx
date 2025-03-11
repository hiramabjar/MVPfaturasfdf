import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, BarChart3, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t",
        className,
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Início</span>
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              isActive("/dashboard/analytics")
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Análise</span>
          </div>
        </Link>

        <div className="flex flex-col items-center justify-center w-full h-full relative">
          <Link
            href="/dashboard/add-invoice"
            className="absolute -top-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>

        <Link
          href="/dashboard/notifications"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              isActive("/dashboard/notifications")
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Alertas</span>
          </div>
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              isActive("/dashboard/profile")
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Perfil</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
