import { DashboardHeader } from "@/components/dashboard/header";
import { InvoicePanel } from "@/components/invoice/invoice-panel";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 bg-background min-h-screen">
      <DashboardHeader />
      <main className="mt-8">
        <InvoicePanel />
      </main>
    </div>
  );
}
