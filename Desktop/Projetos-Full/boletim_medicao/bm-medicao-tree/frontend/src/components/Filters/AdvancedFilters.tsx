import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface Filters {
  concessionaria: string;
  status: string;
  dateRange?: {
    from?: Date | null;
    to?: Date | null;
  };
}

// Valores especiais para representar "todos"
const ALL_CONCESSIONARIA = "TODAS_CONCESSIONARIAS";
const ALL_STATUS = "TODOS_STATUS";

export default function AdvancedFilters({
  filters,
  onFilterChange,
  concessionarias,
  statusOptions,
}: {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  concessionarias: string[];
  statusOptions: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  // Converte o valor do Select para o formato de filtro
  const handleConcessionariaChange = (value: string) => {
    onFilterChange({
      ...filters,
      concessionaria: value === ALL_CONCESSIONARIA ? "" : value,
    });
  };

  // Converte o valor do Select para o formato de filtro
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === ALL_STATUS ? "" : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      concessionaria: "",
      status: "",
      dateRange: {
        from: null,
        to: null,
      },
    });
  };

  // Converte o valor do filtro para o valor do Select
  const getSelectValue = (value: string, allValue: string) =>
    value === "" ? allValue : value;

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2">
        {/* Filtros expandidos */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: expanded ? 1 : 0,
            width: expanded ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 overflow-hidden"
        >
          {/* Filtro Concessionária */}
          <div className="w-[160px]">
            <Select
              value={getSelectValue(filters.concessionaria, ALL_CONCESSIONARIA)}
              onValueChange={handleConcessionariaChange}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Todas concessionárias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CONCESSIONARIA} className="text-xs">
                  Todas
                </SelectItem>
                {concessionarias.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Status */}
          <div className="w-[140px]">
            <Select
              value={getSelectValue(filters.status, ALL_STATUS)}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Todos status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUS} className="text-xs">
                  Todos
                </SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão Limpar */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-red-500 hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>

        {/* Botão principal */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>
      </div>
    </div>
  );
}