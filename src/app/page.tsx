import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ArrowRight, FileText, QrCode, Scan, Upload } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciador de Faturas</h1>
        <ThemeSwitcher />
      </header>

      <main className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Organize suas faturas em um só lugar
          </h2>
          <p className="text-xl text-muted-foreground">
            Capture, organize e gerencie todas as suas faturas bancárias de
            forma simples e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Acessar Painel <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/add-invoice">
                Adicionar Fatura <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Captura Automática</h3>
            <p className="text-muted-foreground">
              Escaneie códigos de barras de boletos e QR codes PIX para extrair
              automaticamente todas as informações.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Importação Direta</h3>
            <p className="text-muted-foreground">
              Importe faturas diretamente do WhatsApp e Gmail ou faça upload de
              arquivos manualmente.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Organização Inteligente
            </h3>
            <p className="text-muted-foreground">
              Visualize suas faturas organizadas por data de vencimento, valor e
              credor, com alertas para vencimentos próximos.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t mt-24">
        <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
          © 2023 Gerenciador de Faturas. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
