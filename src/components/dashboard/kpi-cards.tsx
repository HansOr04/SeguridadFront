// src/components/dashboard/kpi-cards.tsx - SOLO FIX DEL ERROR TYPESCRIPT
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Database, Wifi, WifiOff } from 'lucide-react';
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
  data?: KPIData;
  isLoading?: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  console.log('📊 KPI Cards - Data received:', data, 'Loading:', isLoading);

  const cards = [
    {
      title: "Total Activos",
      value: data?.totalActivos,
      icon: Shield,
      description: "Activos registrados en el sistema",
      color: "text-blue-600"
    },
    {
      title: "Riesgos Críticos", 
      value: data?.riesgosCriticos,
      icon: AlertTriangle,
      description: "Riesgos que requieren atención inmediata",
      color: "text-red-600"
    },
    {
      title: "Vulnerabilidades Activas",
      value: data?.vulnerabilidadesActivas, 
      icon: AlertTriangle,
      description: "Vulnerabilidades sin mitigar",
      color: "text-orange-600"
    },
    {
      title: "Salvaguardas",
      value: data?.salvaguardasImplementadas,
      icon: CheckCircle, 
      description: "Controles de seguridad activos",
      color: "text-green-600"
    }
  ];

  // Estado de carga
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

  // Estado de error/sin datos
  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index} className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <WifiOff className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">--</div>
              <p className="text-xs text-red-500">Error de conexión</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Estado con datos del backend
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const hasValue = card.value !== undefined && card.value !== null;
        
        return (
          <Card key={index} className={!hasValue ? "border-orange-200" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="flex items-center space-x-1">
                <card.icon className={cn("h-4 w-4", card.color)} />
                {hasValue ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <Database className="h-3 w-3 text-orange-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* FIX: Verificar que card.value existe antes de llamar toLocaleString() */}
                {hasValue && card.value !== undefined ? card.value.toLocaleString() : 'N/D'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasValue ? card.description : 'Datos no disponibles'}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}