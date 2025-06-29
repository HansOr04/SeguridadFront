
// 1. FIX: src/components/dashboard/kpi-cards.tsx - Corregir tipos
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPIData {
  totalActivos: number;
  riesgosCriticos: number;
  vulnerabilidadesActivas: number;
  salvaguardasImplementadas: number;
  tendenciaRiesgos: 'up' | 'down' | 'stable';
  efectividadPrograma: number;
}

interface KPICardsProps {
  data?: KPIData; // ✅ Hacer opcional
  isLoading?: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  // ✅ Proveer valores por defecto
  const defaultData: KPIData = {
    totalActivos: 0,
    riesgosCriticos: 0,
    vulnerabilidadesActivas: 0,
    salvaguardasImplementadas: 0,
    tendenciaRiesgos: 'stable',
    efectividadPrograma: 0
  };

  const kpiData = data || defaultData;

  const cards = [
    {
      title: "Total Activos",
      value: kpiData.totalActivos,
      icon: Shield,
      description: "Activos registrados en el sistema",
      color: "text-blue-600"
    },
    {
      title: "Riesgos Críticos", 
      value: kpiData.riesgosCriticos,
      icon: AlertTriangle,
      description: "Riesgos que requieren atención inmediata",
      color: "text-red-600"
    },
    {
      title: "Vulnerabilidades Activas",
      value: kpiData.vulnerabilidadesActivas, 
      icon: AlertTriangle,
      description: "Vulnerabilidades sin mitigar",
      color: "text-orange-600"
    },
    {
      title: "Salvaguardas",
      value: kpiData.salvaguardasImplementadas,
      icon: CheckCircle, 
      description: "Controles de seguridad activos",
      color: "text-green-600"
    }
  ];

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={cn("h-4 w-4", card.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}