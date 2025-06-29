// src/components/dashboard/risk-matrix-chart.tsx - CORREGIDO
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RiskData {
  name: string;
  probability: number;
  impact: number;
  level: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | 'Muy Bajo';
}

interface RiskMatrixChartProps {
  data: RiskData[] | null | undefined; // ✅ Permitir null/undefined
}

const COLORS: Record<string, string> = {
  'Crítico': '#ef4444',
  'Alto': '#f97316', 
  'Medio': '#eab308',
  'Bajo': '#22c55e',
  'Muy Bajo': '#6b7280'
};

// ✅ Datos mock para fallback
const MOCK_DATA: RiskData[] = [
  { name: 'Malware', probability: 7, impact: 8, level: 'Alto' },
  { name: 'Phishing', probability: 8, impact: 6, level: 'Alto' },
  { name: 'DDoS', probability: 4, impact: 9, level: 'Medio' },
  { name: 'Insider Threat', probability: 3, impact: 9, level: 'Medio' },
  { name: 'Data Breach', probability: 5, impact: 10, level: 'Crítico' },
];

export function RiskMatrixChart({ data }: RiskMatrixChartProps) {
  // ✅ Validar y normalizar datos
  const chartData = Array.isArray(data) && data.length > 0 ? data : MOCK_DATA;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz de Riesgos</CardTitle>
        <CardDescription>
          Distribución de riesgos por probabilidad e impacto
          {!Array.isArray(data) && (
            <span className="text-orange-600 block text-xs mt-1">
              * Mostrando datos de ejemplo (backend no disponible)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="probability" 
              name="Probabilidad"
              domain={[0, 10]}
              label={{ value: 'Probabilidad', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impacto"
              domain={[0, 10]}
              label={{ value: 'Impacto', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RiskData;
                  return (
                    <div className="bg-white p-3 border rounded shadow">
                      <p className="font-medium">{data.name}</p>
                      <p>Probabilidad: {data.probability}</p>
                      <p>Impacto: {data.impact}</p>
                      <p>Nivel: <span style={{ color: COLORS[data.level] }}>{data.level}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {Object.keys(COLORS).map((level) => (
              <Scatter
                key={level}
                name={level}
                data={chartData.filter(item => item.level === level)}
                fill={COLORS[level]}
              />
            ))}
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}