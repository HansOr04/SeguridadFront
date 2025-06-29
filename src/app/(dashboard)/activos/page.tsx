'use client';

import { useState } from 'react';
import { Plus, Download, Database, Upload, BarChart3 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetTable } from '@/components/assets/asset-table';
import { AssetFilters } from '@/components/assets/asset-filters';
import { useAssets, useAssetStats } from '@/hooks/use-assets';
import { AssetFilters as AssetFiltersType } from '@/types';

export default function AssetsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AssetFiltersType>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;

  const { data: assetsData, isLoading } = useAssets({
    page,
    limit,
    sort: '-fechaCreacion',
    ...filters,
  });

  const { data: stats } = useAssetStats();

  const assets = assetsData?.data || [];
  const pagination = assetsData?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activos</h1>
          <p className="text-muted-foreground">
            Inventario y gestión de activos de información
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/dashboard/activos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Activo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.general.totalActivos}</div>
              <p className="text-xs text-muted-foreground">
                Activos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.general.valorTotalEconomico?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor económico total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Criticidad Promedio</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.general.criticidadPromedio?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Sobre 10 puntos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Activos</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.porTipo?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Categorías diferentes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <AssetFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Activos</CardTitle>
          <CardDescription>
            {pagination && `${pagination.total} activos encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Cargando activos...</div>
            </div>
          ) : (
            <AssetTable
              assets={assets}
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
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, pagination.total)} de {pagination.total} activos
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