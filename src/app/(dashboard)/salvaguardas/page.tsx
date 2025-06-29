// src/app/(dashboard)/salvaguardas/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Download, ShieldCheck, TrendingUp, DollarSign, Target } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSafeguards, useSafeguardStats, useSafeguardCoverage, useSafeguardEffectiveness } from '@/hooks/use-safeguards';
import { SafeguardFilters } from '@/lib/safeguard-service';

export default function SafeguardsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SafeguardFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;

  const { data: safeguardsData, isLoading } = useSafeguards({
    page,
    limit,
    sort: '-efectividad',
    ...filters,
  });

  const { data: stats } = useSafeguardStats();
  const { data: coverage } = useSafeguardCoverage();
  const { data: effectiveness } = useSafeguardEffectiveness();

  const safeguards = safeguardsData?.data || [];
  const pagination = safeguardsData?.pagination;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Operativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'Implementada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Implementación': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Planificada': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Preventiva': return 'bg-green-100 text-green-800';
      case 'Detectiva': return 'bg-blue-100 text-blue-800';
      case 'Correctiva': return 'bg-orange-100 text-orange-800';
      case 'Disuasiva': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Salvaguardas</h1>
          <p className="text-muted-foreground">
            Controles de seguridad para la protección de activos y mitigación de riesgos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/dashboard/salvaguardas/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Salvaguarda
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Salvaguardas</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.general.totalSalvaguardas}</div>
              <p className="text-xs text-muted-foreground">
                Controles registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salvaguardas Operativas</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.general.salvaguardasOperativas}
              </div>
              <p className="text-xs text-muted-foreground">
                En funcionamiento activo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efectividad Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.general.efectividadPromedio?.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Efectividad global
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.general.costoTotalImplementacion + stats.general.costoTotalMantenimiento).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Implementación + Mantenimiento
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coverage Overview */}
      {coverage && (
        <Card>
          <CardHeader>
            <CardTitle>Cobertura de Amenazas</CardTitle>
            <CardDescription>
              Análisis de cobertura de salvaguardas sobre amenazas identificadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cobertura Total</span>
                <span className="text-2xl font-bold">{coverage.coveragePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={coverage.coveragePercentage} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amenazas Cubiertas: </span>
                  <span className="font-medium">{coverage.coveredThreats}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amenazas: </span>
                  <span className="font-medium">{coverage.totalThreats}</span>
                </div>
              </div>
              {coverage.uncoveredThreats.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Amenazas Sin Cobertura:</h4>
                  <div className="space-y-2">
                    {coverage.uncoveredThreats.slice(0, 3).map((threat) => (
                      <div key={threat._id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">{threat.codigo} - {threat.nombre}</span>
                        <Badge variant="destructive">{threat.riskLevel}</Badge>
                      </div>
                    ))}
                    {coverage.uncoveredThreats.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ...y {coverage.uncoveredThreats.length - 3} amenazas más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="effectiveness">Efectividad</TabsTrigger>
          <TabsTrigger value="implementation">Implementación</TabsTrigger>
          <TabsTrigger value="costs">Costos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Safeguards */}
          <Card>
            <CardHeader>
              <CardTitle>Salvaguardas Recientes</CardTitle>
              <CardDescription>
                Últimas salvaguardas con mayor efectividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Cargando salvaguardas...</div>
                </div>
              ) : safeguards.length > 0 ? (
                <div className="space-y-4">
                  {safeguards.slice(0, 5).map((safeguard) => (
                    <div key={safeguard._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{safeguard.codigo}</h4>
                          <Badge className={getTypeColor(safeguard.tipo)} variant="outline">
                            {safeguard.tipo}
                          </Badge>
                          <Badge className={getStatusColor(safeguard.estado)} variant="outline">
                            {safeguard.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{safeguard.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Categoría: {safeguard.categoria} | Responsable: {safeguard.responsableImplementacion}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{safeguard.efectividad}%</div>
                        <div className="text-xs text-muted-foreground">Efectividad</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay salvaguardas registradas
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats by Type and Category */}
          {stats && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.porTipo.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{item._id}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({item.efectividadPromedio?.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estados de Implementación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.porEstado.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{item._id}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Efectividad</CardTitle>
              <CardDescription>
                Métricas de rendimiento y efectividad de salvaguardas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {effectiveness && effectiveness.length > 0 ? (
                <div className="space-y-4">
                  {effectiveness.slice(0, 10).map((item) => (
                    <div key={item.safeguard} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Salvaguarda: {item.safeguard}</h4>
                        <Badge variant="outline">{item.effectiveness}% efectiva</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cobertura: </span>
                          <span className="font-medium">{item.coverage}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">MTTR: </span>
                          <span className="font-medium">{item.metrics.mttr} min</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Disponibilidad: </span>
                          <span className="font-medium">{item.metrics.availability}%</span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Prevenidos: </span>
                          <span className="font-medium text-green-600">{item.incidents.prevented}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Detectados: </span>
                          <span className="font-medium text-blue-600">{item.incidents.detected}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mitigados: </span>
                          <span className="font-medium text-orange-600">{item.incidents.mitigated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos de efectividad disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Implementación</CardTitle>
              <CardDescription>
                Seguimiento del progreso de implementación de salvaguardas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Dashboard de implementación (pendiente de implementar)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Costos</CardTitle>
              <CardDescription>
                Análisis de costos de implementación y mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        ${stats.general.costoTotalImplementacion.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Costo Implementación</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        ${stats.general.costoTotalMantenimiento.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Costo Mantenimiento</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Costos por Categoría</h4>
                    <div className="space-y-3">
                      {stats.porCategoria.map((item) => (
                        <div key={item._id} className="flex items-center justify-between">
                          <span className="text-sm">{item._id}</span>
                          <div className="text-right">
                            <div className="font-medium">${item.costoPromedio.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{item.count} salvaguardas</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas para la gestión de salvaguardas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/salvaguardas/nueva">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Nueva Salvaguarda</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Análisis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Target className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Cobertura</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Exportar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, pagination.total)} de {pagination.total} salvaguardas
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