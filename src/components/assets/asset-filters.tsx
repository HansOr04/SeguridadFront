'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AssetFilters } from '@/types'; // ✅ Cambiar a type-only import

interface AssetFiltersComponentProps { // ✅ Renombrar la interface
  filters: AssetFilters;
  onFiltersChange: (filters: AssetFilters) => void;
}

const TIPOS_ACTIVO = [
  'Hardware',
  'Software', 
  'Datos/Información',
  'Comunicaciones',
  'Servicios',
  'Instalaciones',
  'Personal'
];

export function AssetFilters({ filters, onFiltersChange }: AssetFiltersComponentProps) { // ✅ Usar el nuevo nombre
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof AssetFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar activos..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={filters.tipo || ''}
              onValueChange={(value) => updateFilter('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {TIPOS_ACTIVO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Propietario</label>
            <Input
              placeholder="Filtrar por propietario"
              value={filters.propietario || ''}
              onChange={(e) => updateFilter('propietario', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Input
              placeholder="Filtrar por categoría"
              value={filters.categoria || ''}
              onChange={(e) => updateFilter('categoria', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}