// src/app/(dashboard)/amenazas/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Download, Lock, AlertTriangle, Shield, RefreshCw, Database } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThreats, useThreatStats, useThreatMutations } from '@/hooks/use-threats';
import { ThreatFilters } from '@/lib/threat-service';

export default function ThreatsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ThreatFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;

  const { data: threatsData, isLoading } = useThreats({
    page,
    limit,
    sort: '-probabilidad',
    ...filters,
  });

  const { data: stats } = useThreatStats();
  const { importMagerit, syncExternal, isImporting, isSyncing } = useThreatMutations();

  const threats = threatsData?.data || [];
  const pagination = threatsData?.pagination;

  const handleImportMagerit = () => {
    if (confirm('¿Desea importar las amenazas del catálogo MAGERIT v3.0? Este proceso puede tomar varios minutos.')) {
      importMagerit();
    }
  };

  const handleSyncExternal = () => {
    if (confirm('¿Desea sincronizar con fuentes externas de amenazas? Este proceso puede tomar varios minutos.')) {
      syncExternal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Amenazas</h1>
          <p className="text-muted-foreground">
            Identificación y análisis de amenazas según catálogo MAGERIT v3.0
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSyncExternal}
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleImportMagerit}
            disabled={isImporting}
          >
            <Database className={`mr-2 h-4 w-4 ${isImporting ? 'animate-spin' : ''}`} />
            {isImporting ? 'Importando...' : 'MAGERIT'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/dashboard/amenazas/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Amenaza
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amenazas</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.general.totalAmenazas}</div>
              <p className="text-xs text-muted-foreground">
                Amenazas identificadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amenazas Críticas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.general.amenazasCriticas}
              </div>
              <p className="text-xs text-muted-foreground">
                Nivel crítico de probabilidad
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amenazas Activas</CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.general.amenazasActivas}
              </div>
              <p className="text-xs text-muted-foreground">
                Bajo monitoreo activo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Probabilidad Promedio</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.general.probabilidadPromedio?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Sobre 10 puntos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="intelligence">Inteligencia</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Threat Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Amenazas por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.porTipo ? (
                  <div className="space-y-3">
                    {stats.porTipo.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{item._id}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay datos disponibles
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Latest Threats */}
          <Card>
            <CardHeader>
              <CardTitle>Amenazas Recientes</CardTitle>
              <CardDescription>
                Últimas amenazas identificadas con mayor probabilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Cargando amenazas...</div>
                </div>
              ) : threats.length > 0 ? (
                <div className="space-y-4">
                  {threats.slice(0, 5).map((threat) => (
                    <div key={threat._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{threat.codigo}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            threat.tipo === 'Humana' ? 'bg-red-100 text-red-800' :
                            threat.tipo === 'Tecnológica' ? 'bg-blue-100 text-blue-800' :
                            threat.tipo === 'Natural' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {threat.tipo}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            threat.origen === 'Externa' ? 'bg-orange-100 text-orange-800' :
                            threat.origen === 'Interna' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {threat.origen}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{threat.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Categoría: {threat.categoria} | Estado: {threat.estado}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{threat.probabilidad}/10</div>
                        <div className="text-xs text-muted-foreground">Probabilidad</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay amenazas registradas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Amenazas MAGERIT</CardTitle>
              <CardDescription>
                Gestión del catálogo completo de amenazas según MAGERIT v3.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Importar Catálogo MAGERIT</h4>
                    <p className="text-sm text-muted-foreground">
                      Importar todas las amenazas del catálogo oficial MAGERIT v3.0
                    </p>
                  </div>
                  <Button 
                    onClick={handleImportMagerit}
                    disabled={isImporting}
                  >
                    {isImporting ? 'Importando...' : 'Importar'}
                  </Button>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  Tabla del catálogo de amenazas (pendiente de implementar)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Amenazas</CardTitle>
              <CardDescription>
                Análisis temporal de la evolución de amenazas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Gráficos de tendencias (pendiente de implementar)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence">
          <Card>
            <CardHeader>
              <CardTitle>Inteligencia de Amenazas</CardTitle>
              <CardDescription>
                Feeds externos y análisis de inteligencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sincronizar Fuentes Externas</h4>
                    <p className="text-sm text-muted-foreground">
                      Actualizar amenazas desde feeds de inteligencia externos
                    </p>
                  </div>
                  <Button 
                    onClick={handleSyncExternal}
                    disabled={isSyncing}
                  >
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                  </Button>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  Panel de inteligencia de amenazas (pendiente de implementar)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas para la gestión de amenazas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/amenazas/nueva">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Nueva Amenaza</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" onClick={handleImportMagerit}>
              <Database className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">MAGERIT</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" onClick={handleSyncExternal}>
              <RefreshCw className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Sincronizar</span>
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
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, pagination.total)} de {pagination.total} amenazas
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