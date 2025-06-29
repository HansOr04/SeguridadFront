// src/components/dashboard/risk-matrix-chart.tsx - CORREGIDO
'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface RiskMatrixData {
  name: string;
  probability: number;
  impact: number;
  level: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | 'Muy Bajo';
}

interface RiskMatrixChartProps {
  data?: RiskMatrixData[];
  isLoading?: boolean;
}

export function RiskMatrixChart({ data, isLoading }: RiskMatrixChartProps) {
  console.log('🎯 Risk Matrix Chart - Data received:', data, 'Loading:', isLoading);

  // Colores para cada nivel de riesgo
  const riskColors: Record<string, string> = {
    'Crítico': '#dc2626',
    'Alto': '#ea580c', 
    'Medio': '#d97706',
    'Bajo': '#65a30d',
    'Muy Bajo': '#16a34a'
  };

  // Estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Matriz de Riesgos</span>
          </CardTitle>
          <CardDescription>
            Distribución de riesgos por probabilidad e impacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Cargando matriz de riesgos...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verificar que data existe y es un array - FIX PRINCIPAL
  const validData = Array.isArray(data) ? data : [];
  
  // Estado sin datos
  if (validData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Matriz de Riesgos</span>
          </CardTitle>
          <CardDescription>
            Distribución de riesgos por probabilidad e impacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay datos de riesgos disponibles</p>
              <p className="text-sm">Los riesgos aparecerán cuando se calculen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Probabilidad: {data.probability}/10
          </p>
          <p className="text-sm text-muted-foreground">
            Impacto: {data.impact}/10
          </p>
          <p className="text-sm font-medium" style={{ color: riskColors[data.level] }}>
            Nivel: {data.level}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Matriz de Riesgos</span>
        </CardTitle>
        <CardDescription>
          Distribución de {validData.length} riesgos por probabilidad e impacto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            data={validData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="probability" 
              name="Probabilidad"
              domain={[0, 10]}
              tickCount={6}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impacto"
              domain={[0, 10]}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey="impact" name="Riesgos">
              {validData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={riskColors[entry.level] || '#6b7280'} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground">{level}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}