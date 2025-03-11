import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { useEffect } from "react";

interface FilterCriteria {
  creditor: string;
  minAmount: string;
  maxAmount: string;
  dueDate: Date | null;
  status: string;
}

interface InvoiceFiltersProps {
  criteria: FilterCriteria;
  onChange: (criteria: Partial<FilterCriteria>) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

export function InvoiceFilters({
  criteria,
  onChange,
  onClear,
  onApply,
  onClose,
}: InvoiceFiltersProps) {
  // Aplicar filtros quando o componente é montado
  useEffect(() => {
    return () => {
      // Limpar filtros quando o componente é desmontado
    };
  }, []);

  return (
    <div className="bg-muted/40 p-4 rounded-lg space-y-4 border border-border/40">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm md:text-base">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creditor" className="text-xs">
            Credor
          </Label>
          <Input
            id="creditor"
            placeholder="Nome do credor"
            className="h-9"
            value={criteria.creditor}
            onChange={(e) => onChange({ creditor: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs">
            Valor
          </Label>
          <div className="flex gap-2">
            <Input
              id="min-amount"
              placeholder="Mínimo"
              type="number"
              className="h-9"
              value={criteria.minAmount}
              onChange={(e) => onChange({ minAmount: e.target.value })}
            />
            <Input
              id="max-amount"
              placeholder="Máximo"
              type="number"
              className="h-9"
              value={criteria.maxAmount}
              onChange={(e) => onChange({ maxAmount: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Data de Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-9",
                  !criteria.dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {criteria.dueDate
                  ? criteria.dueDate.toLocaleDateString()
                  : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={criteria.dueDate || undefined}
                onSelect={(date) => onChange({ dueDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs">
            Status
          </Label>
          <Select
            value={criteria.status}
            onValueChange={(value) => onChange({ status: value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecionar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full md:w-auto"
          onClick={onClear}
        >
          Limpar
        </Button>
        <Button size="sm" className="w-full md:w-auto" onClick={onApply}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
