// src/app/(dashboard)/dashboard/page.tsx - DASHBOARD OPTIMIZADO
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('📊 Dashboard mounted');
  }, []);

  // Hooks para datos con manejo optimizado de errores
  const { 
    data: kpis, 
    isLoading: kpisLoading, 
    refetch: refetchKPIs,
    error: kpisError 
  } = useDashboardKPIs();

  const { 
    data: riskMatrix, 
    isLoading: riskLoading,
    error: riskError 
  } = useRiskMatrix();

  const { 
    data: trends, 
    isLoading: trendsLoading,
    error: trendsError 
  } = useTrendData(timeRange);

  const { 
    data: activities, 
    isLoading: activitiesLoading,
    error: activitiesError 
  } = useActivityFeed(10);

  // Memoizar el estado de carga general
  const isGeneralLoading = useMemo(() => {
    return kpisLoading || riskLoading || trendsLoading || activitiesLoading;
  }, [kpisLoading, riskLoading, trendsLoading, activitiesLoading]);

  // Memoizar si hay errores críticos
  const hasCriticalErrors = useMemo(() => {
    return !!(kpisError || riskError || trendsError || activitiesError);
  }, [kpisError, riskError, trendsError, activitiesError]);

  const handleRefresh = () => {
    console.log('🔄 Refreshing dashboard data');
    refetchKPIs();
  };

  // Loading inicial
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
            <p className="text-muted-foreground">
              Resumen ejecutivo del estado de seguridad
            </p>
          </div>
          <Button variant="outline" disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
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
        <div className="flex items-center space-x-2">
          {hasCriticalErrors && (
            <div className="flex items-center text-orange-600 text-sm mr-4">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Algunos datos no están disponibles
            </div>
          )}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isGeneralLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGeneralLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards - Siempre mostrar, incluso con errores */}
      <KPICards data={kpis} isLoading={kpisLoading} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Matriz de Riesgos */}
        <div className="col-span-2">
          <RiskMatrixChart data={riskMatrix || []} isLoading={riskLoading} />
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activities || []} isLoading={activitiesLoading} />
      </div>

      {/* Trends Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Análisis de Tendencias
              </CardTitle>
              <CardDescription>
                Evolución de riesgos, vulnerabilidades y salvaguardas
              </CardDescription>
            </div>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as '7d' | '30d' | '90d')}>
              <TabsList>
                <TabsTrigger value="7d">7 días</TabsTrigger>
                <TabsTrigger value="30d">30 días</TabsTrigger>
                <TabsTrigger value="90d">90 días</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TrendChart data={trends || []} timeRange={timeRange} />
        </CardContent>
      </Card>

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
                <div className="text-sm font-medium">Nuevo Activo</div>
                <div className="text-xs text-muted-foreground">Registrar activo</div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/vulnerabilidades/nueva">
                <div className="text-sm font-medium">Nueva Vulnerabilidad</div>
                <div className="text-xs text-muted-foreground">Registrar vulnerabilidad</div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/riesgos">
                <div className="text-sm font-medium">Matriz Riesgos</div>
                <div className="text-xs text-muted-foreground">Analizar riesgos</div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/activos">
                <div className="text-sm font-medium">Gestionar Activos</div>
                <div className="text-xs text-muted-foreground">Ver inventario</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}