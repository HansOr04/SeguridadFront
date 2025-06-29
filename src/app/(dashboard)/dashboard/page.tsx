// src/app/(dashboard)/page.tsx - TU ARCHIVO EXISTENTE CON FIX DE HIDRATACIÓN
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Importar componentes del dashboard
import { KPICards } from '@/components/dashboard/kpi-cards';
import { RiskMatrixChart } from '@/components/dashboard/risk-matrix-chart';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

// Importar hooks
import { 
  useDashboardKPIs, 
  useRiskMatrix, 
  useTrendData, 
  useActivityFeed 
} from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isMounted, setIsMounted] = useState(false); // ✅ Agregado para hidratación

  // ✅ Marcar como montado en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hooks para datos
  const { data: kpis, isLoading: kpisLoading, refetch: refetchKPIs } = useDashboardKPIs();
  const { data: riskMatrix, isLoading: riskLoading } = useRiskMatrix();
  const { data: trends, isLoading: trendsLoading } = useTrendData(timeRange);
  const { data: activities, isLoading: activitiesLoading } = useActivityFeed(10);

  const handleRefresh = () => {
    refetchKPIs();
  };

  // ✅ No renderizar hasta que esté montado (evita hidratación mismatch)
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
            <p className="text-muted-foreground">
              Resumen ejecutivo del estado de seguridad de la organización
            </p>
          </div>
          <Button variant="outline" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
          <p className="text-muted-foreground">
            Resumen ejecutivo del estado de seguridad de la organización
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={kpisLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${kpisLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <KPICards data={kpis} isLoading={kpisLoading} />

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Matriz de Riesgos */}
        <div className="col-span-2">
          {riskLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Riesgos</CardTitle>
                <CardDescription>Cargando datos...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RiskMatrixChart data={riskMatrix || []} />
          )}
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activities || []} isLoading={activitiesLoading} />
      </div>

      {/* Trends Section */}
      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as '7d' | '30d' | '90d')}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Análisis de Tendencias</h2>
          <TabsList>
            <TabsTrigger value="7d">7 días</TabsTrigger>
            <TabsTrigger value="30d">30 días</TabsTrigger>
            <TabsTrigger value="90d">90 días</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={timeRange} className="mt-4">
          {trendsLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Seguridad</CardTitle>
                <CardDescription>Cargando datos...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <TrendChart data={trends || []} timeRange={timeRange} />
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funcionalidades más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/activos/nuevo">
                <span className="text-sm font-medium">Nuevo Activo</span>
                <span className="text-xs text-muted-foreground">Registrar activo</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <span className="text-sm font-medium">Escanear</span>
              <span className="text-xs text-muted-foreground">Buscar vulnerabilidades</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/riesgos">
                <span className="text-sm font-medium">Matriz Riesgos</span>
                <span className="text-xs text-muted-foreground">Analizar riesgos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <span className="text-sm font-medium">Reporte</span>
              <span className="text-xs text-muted-foreground">Generar informe</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}