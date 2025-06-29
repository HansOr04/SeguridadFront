// src/components/risks/risk-calculator.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRiskCalculation } from '@/hooks/use-risks';
import { useAssets } from '@/hooks/use-assets';
import { RiskCalculationRequest, RiskCalculationResult } from '@/lib/risk-service';

const calculationSchema = z.object({
  activo: z.string().min(1, 'Debe seleccionar un activo'),
  amenaza: z.string().min(1, 'Debe seleccionar una amenaza'),
  vulnerabilidad: z.string().optional(),
  probabilidad: z.number().min(1).max(10),
  impacto: z.number().min(1).max(10),
});

type CalculationFormData = z.infer<typeof calculationSchema>;

interface RiskCalculatorProps {
  onCalculationComplete?: (result: RiskCalculationResult) => void;
}

export function RiskCalculator({ onCalculationComplete }: RiskCalculatorProps) {
  const [result, setResult] = useState<RiskCalculationResult | null>(null);
  const { data: assetsData } = useAssets({ limit: 100 });
  const calculateRisk = useRiskCalculation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CalculationFormData>({
    resolver: zodResolver(calculationSchema),
    defaultValues: {
      probabilidad: 5,
      impacto: 5,
    },
  });

  const watchedValues = watch();
  const assets = assetsData?.data || [];

  const onSubmit = async (data: CalculationFormData) => {
    try {
      const calculationData: RiskCalculationRequest = {
        activo: data.activo,
        amenaza: data.amenaza,
        vulnerabilidad: data.vulnerabilidad,
        probabilidad: data.probabilidad,
        impacto: data.impacto,
      };

      calculateRisk.mutate(calculationData, {
        onSuccess: (result) => {
          setResult(result);
          onCalculationComplete?.(result);
        },
      });
    } catch (error) {
      console.error('Error calculating risk:', error);
    }
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200';
      case 'Alto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bajo': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (nivel: string) => {
    switch (nivel) {
      case 'Crítico': 
      case 'Alto': 
        return AlertTriangle;
      case 'Medio': 
        return TrendingUp;
      default: 
        return Shield;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Formulario de Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Calculadora de Riesgos MAGERIT
          </CardTitle>
          <CardDescription>
            Calcule el nivel de riesgo basado en la metodología MAGERIT v3.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selección de Activo */}
            <div className="space-y-2">
              <Label>Activo *</Label>
              <Select
                value={watchedValues.activo}
                onValueChange={(value) => setValue('activo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar activo" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset._id} value={asset._id}>
                      {asset.codigo} - {asset.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.activo && (
                <p className="text-sm text-red-500">{errors.activo.message}</p>
              )}
            </div>

            {/* Selección de Amenaza */}
            <div className="space-y-2">
              <Label>Amenaza *</Label>
              <Select
                value={watchedValues.amenaza}
                onValueChange={(value) => setValue('amenaza', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar amenaza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malware">Malware</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="ddos">DDoS</SelectItem>
                  <SelectItem value="insider">Amenaza Interna</SelectItem>
                  <SelectItem value="physical">Acceso Físico</SelectItem>
                </SelectContent>
              </Select>
              {errors.amenaza && (
                <p className="text-sm text-red-500">{errors.amenaza.message}</p>
              )}
            </div>

            {/* Probabilidad */}
            <div className="space-y-2">
              <Label>
                Probabilidad: {watchedValues.probabilidad}/10
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                {...register('probabilidad', { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muy Improbable (1)</span>
                <span>Muy Probable (10)</span>
              </div>
            </div>

            {/* Impacto */}
            <div className="space-y-2">
              <Label>
                Impacto: {watchedValues.impacto}/10
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                {...register('impacto', { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muy Bajo (1)</span>
                <span>Muy Alto (10)</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={calculateRisk.isPending}
            >
              {calculateRisk.isPending ? 'Calculando...' : 'Calcular Riesgo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-6">
        {result ? (
          <>
            {/* Riesgo Inherente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  RIESGO INHERENTE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold">
                    {result.riesgoInherente.toFixed(1)}
                  </div>
                  <Badge 
                    className={getRiskColor(result.nivelRiesgoInherente)}
                    variant="outline"
                  >
                    {result.nivelRiesgoInherente}
                  </Badge>
                </div>
                <Progress 
                  value={(result.riesgoInherente / 10) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Riesgo sin considerar salvaguardas
                </p>
              </CardContent>
            </Card>

            {/* Riesgo Residual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  RIESGO RESIDUAL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold">
                    {result.riesgoResidual.toFixed(1)}
                  </div>
                  <Badge 
                    className={getRiskColor(result.nivelRiesgoResidual)}
                    variant="outline"
                  >
                    {result.nivelRiesgoResidual}
                  </Badge>
                </div>
                <Progress 
                  value={(result.riesgoResidual / 10) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Riesgo después de aplicar salvaguardas
                </p>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            {result.recomendaciones && result.recomendaciones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    RECOMENDACIONES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                        <span className="text-sm">{recomendacion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete el formulario para calcular el riesgo</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}