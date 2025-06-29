// src/components/dashboard/trend-chart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrendData {
  date: string;
  riesgos: number;
  vulnerabilidades: number;
  salvaguardas: number;
}

interface TrendChartProps {
  data: TrendData[];
  timeRange: '7d' | '30d' | '90d';
}

export function TrendChart({ data, timeRange }: TrendChartProps) {
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeRange === '7d') {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de Seguridad</CardTitle>
        <CardDescription>
          Evolución de riesgos, vulnerabilidades y salvaguardas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => formatXAxis(value)}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="riesgos" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Riesgos"
            />
            <Line 
              type="monotone" 
              dataKey="vulnerabilidades" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Vulnerabilidades"
            />
            <Line 
              type="monotone" 
              dataKey="salvaguardas" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="Salvaguardas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}