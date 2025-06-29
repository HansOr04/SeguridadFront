// src/app/(dashboard)/riesgos/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Calculator, RefreshCw, Download, BarChart3, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskCalculator } from '@/components/risks/risk-calculator';
import { useRisks, useRiskStats, useRiskMutations } from '@/hooks/use-risks';
import { RiskFilters } from '@/lib/risk-service';

export default function RisksPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RiskFilters>({});
  const limit = 10;

  const { data: risksData, isLoading } = useRisks({
    page,
    limit,
    sort: '-riesgoResidual',
    ...filters,
  });

  const { data: stats } = useRiskStats();
  const { recalculateAll, isRecalculating } = useRiskMutations();

  const risks = risksData?.data || [];
  const pagination = risksData?.pagination;

  const handleRecalculateAll = () => {
    if (confirm('¿Está seguro de que desea recalcular todos los riesgos? Este proceso puede tomar varios minutos.')) {
      recalculateAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Riesgos</h1>
          <p className="text-muted-foreground">
            Identificación, análisis y tratamiento de riesgos según MAGERIT v3.0
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRecalculateAll}
            disabled={isRecalculating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
            {isRecalculating ? 'Recalculando...' : 'Recalcular Todo'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/dashboard/riesgos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Análisis
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Riesgos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.general.totalRiesgos}</div>
              <p className="text-xs text-muted-foreground">
                Riesgos identificados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgos Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.general.riesgosCriticos}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgos Altos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.general.riesgosAltos}
              </div>
              <p className="text-xs text-muted-foreground">
                Prioridad alta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgo Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.general.riesgoPromedio?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Sobre 10 puntos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="matrix">Matriz</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Risks */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Riesgos Críticos</CardTitle>
              <CardDescription>
                Riesgos con mayor nivel de riesgo residual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Cargando riesgos...</div>
                </div>
              ) : risks.length > 0 ? (
                <div className="space-y-4">
                  {risks.slice(0, 10).map((risk) => (
                    <div key={risk._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{risk.codigo}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            risk.nivelRiesgo === 'Crítico' ? 'bg-red-100 text-red-800' :
                            risk.nivelRiesgo === 'Alto' ? 'bg-orange-100 text-orange-800' :
                            risk.nivelRiesgo === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {risk.nivelRiesgo}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{risk.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          Activo: {risk.activo.codigo} | Amenaza: {risk.amenaza.codigo}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{risk.riesgoResidual.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Riesgo Residual</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay riesgos registrados
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {stats && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Nivel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.porNivel.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{item._id}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estados de Tratamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.porTratamiento.map((item) => (
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

        <TabsContent value="calculator">
          <RiskCalculator />
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Riesgos</CardTitle>
              <CardDescription>
                Visualización de riesgos por probabilidad e impacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Matriz de riesgos interactiva (pendiente de implementar)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista Completa de Riesgos</CardTitle>
              <CardDescription>
                {pagination && `${pagination.total} riesgos encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Tabla completa de riesgos (pendiente de implementar)
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
            Herramientas para la gestión de riesgos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/riesgos/nuevo">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Nuevo Riesgo</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Calculator className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Calculadora</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Reportes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Exportar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}