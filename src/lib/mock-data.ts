export interface Invoice {
  id: string;
  creditor: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  paymentMethod: "boleto" | "pix" | "credit_card" | "other";
  barcode?: string;
  pixCode?: string;
  createdAt: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    creditor: "Enel Energia",
    description: "Conta de energia - Maio/2023",
    amount: 187.45,
    dueDate: "15/05/2023",
    status: "paid",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "01/05/2023",
  },
  {
    id: "inv-002",
    creditor: "Sabesp",
    description: "Conta de água - Maio/2023",
    amount: 98.32,
    dueDate: "20/05/2023",
    status: "paid",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "05/05/2023",
  },
  {
    id: "inv-003",
    creditor: "Claro",
    description: "Internet Fibra 300MB - Junho/2023",
    amount: 119.9,
    dueDate: "10/06/2023",
    status: "pending",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "01/06/2023",
  },
  {
    id: "inv-004",
    creditor: "Condomínio Edifício Aurora",
    description: "Taxa condominial - Junho/2023",
    amount: 450.0,
    dueDate: "05/06/2023",
    status: "overdue",
    paymentMethod: "pix",
    pixCode:
      "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142a1dd1d55520400005303986540510.005802BR5913Condominio6008Sao Paulo62070503***6304E2CA",
    createdAt: "01/06/2023",
  },
  {
    id: "inv-005",
    creditor: "Escola Criativa",
    description: "Mensalidade escolar - Junho/2023",
    amount: 1250.0,
    dueDate: "15/06/2023",
    status: "pending",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "01/06/2023",
  },
  {
    id: "inv-006",
    creditor: "Plano de Saúde Vida",
    description: "Plano familiar - Junho/2023",
    amount: 789.9,
    dueDate: "20/06/2023",
    status: "pending",
    paymentMethod: "credit_card",
    createdAt: "01/06/2023",
  },
  {
    id: "inv-007",
    creditor: "Academia Corpo em Forma",
    description: "Mensalidade - Junho/2023",
    amount: 99.9,
    dueDate: "10/06/2023",
    status: "pending",
    paymentMethod: "pix",
    pixCode:
      "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142a1dd1d55520400005303986540510.005802BR5913Academia6008Sao Paulo62070503***6304D32A",
    createdAt: "01/06/2023",
  },
  {
    id: "inv-008",
    creditor: "Cartão Nubank",
    description: "Fatura - Maio/2023",
    amount: 2456.78,
    dueDate: "10/05/2023",
    status: "paid",
    paymentMethod: "credit_card",
    createdAt: "01/05/2023",
  },
  {
    id: "inv-009",
    creditor: "IPTU 2023",
    description: "Parcela 5/10",
    amount: 213.45,
    dueDate: "15/05/2023",
    status: "paid",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "01/05/2023",
  },
  {
    id: "inv-010",
    creditor: "Seguro Auto",
    description: "Parcela 3/12 - Honda Civic",
    amount: 189.9,
    dueDate: "25/05/2023",
    status: "overdue",
    paymentMethod: "boleto",
    barcode: "34191790010104351004791020150008291070026000",
    createdAt: "01/05/2023",
  },
];
