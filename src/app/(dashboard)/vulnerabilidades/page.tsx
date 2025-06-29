'use client';

import { useState } from 'react';
import { Plus, Download, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VulnerabilityTable } from '@/components/vulnerabilities/vulnerability-table';
import { VulnerabilityFiltersComponent } from '@/components/vulnerabilities/vulnerability-filters';
import { useVulnerabilities, useVulnerabilityMutations, useVulnerabilityStats } from '@/hooks/use-vulnerabilities';
import { VulnerabilityFilters } from '@/types';

export default function VulnerabilitiesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VulnerabilityFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;

  const { data: vulnerabilitiesData, isLoading } = useVulnerabilities({
    page,
    limit,
    sort: '-fechaDeteccion',
    ...filters,
  });

  const { data: stats } = useVulnerabilityStats();
  const { bulkAction } = useVulnerabilityMutations();

  const vulnerabilities = vulnerabilitiesData?.data || [];
  const pagination = vulnerabilitiesData?.pagination;

  const handleBulkAction = (action: 'mitigate' | 'reopen' | 'delete') => {
    if (selectedIds.length === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`¿Está seguro de que desea eliminar ${selectedIds.length} vulnerabilidades?`)) {
        return;
      }
    }

    bulkAction({ action, ids: selectedIds });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vulnerabilidades</h1>
          <p className="text-muted-foreground">
            Gestión y análisis de vulnerabilidades identificadas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/dashboard/vulnerabilidades/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Vulnerabilidad
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.general.totalVulnerabilidades}</div>
              <p className="text-xs text-muted-foreground">
                Vulnerabilidades registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.general.vulnerabilidadesCriticas}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Altas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.general.vulnerabilidadesAltas}
              </div>
              <p className="text-xs text-muted-foreground">
                Prioridad alta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facilidad Promedio</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.general.facilidadPromedio?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Sobre 10 puntos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <VulnerabilityFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} vulnerabilidades seleccionadas
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mitigate')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Mitigar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('reopen')}
                >
                  Reabrir
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vulnerabilidades</CardTitle>
          <CardDescription>
            {pagination && `${pagination.total} vulnerabilidades encontradas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Cargando vulnerabilidades...</div>
            </div>
          ) : (
            <VulnerabilityTable
              vulnerabilities={vulnerabilities}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, pagination.total)} de {pagination.total} vulnerabilidades
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.pages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}