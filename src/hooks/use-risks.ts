// src/hooks/use-risks.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riskService, RiskFilters, CreateRiskRequest, RiskCalculationRequest } from '@/lib/risk-service';
import { toast } from 'sonner';

const QUERY_KEYS = {
  risks: ['risks'],
  risk: (id: string) => ['risk', id],
  stats: ['risks', 'stats'],
  matrix: ['risks', 'matrix'],
  topRisks: (limit: number) => ['risks', 'top', limit],
  dashboard: ['risks', 'dashboard'],
  calculation: ['risks', 'calculation'],
};

export function useRisks(params: {
  page?: number;
  limit?: number;
  sort?: string;
} & RiskFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.risks, params],
    queryFn: () => riskService.getRisks(params),
  });
}

export function useRisk(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.risk(id),
    queryFn: () => riskService.getRiskById(id),
    enabled: !!id,
  });
}

export function useRiskStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => riskService.getStats(),
  });
}

export function useRiskMatrix() {
  return useQuery({
    queryKey: QUERY_KEYS.matrix,
    queryFn: () => riskService.getRiskMatrix(),
    refetchInterval: 300000, // Refetch cada 5 minutos
  });
}

export function useTopRisks(limit: number = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.topRisks(limit),
    queryFn: () => riskService.getTopRisks(limit),
    refetchInterval: 60000, // Refetch cada minuto
  });
}

export function useRiskDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => riskService.getDashboard(),
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

export function useRiskCalculation() {
  return useMutation({
    mutationFn: riskService.calculateRisk,
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al calcular riesgo');
    },
  });
}

export function useRiskMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: riskService.createRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.risks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matrix });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Riesgo creado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear riesgo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRiskRequest> }) =>
      riskService.updateRisk(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.risks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matrix });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Riesgo actualizado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al actualizar riesgo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: riskService.deleteRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.risks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matrix });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Riesgo eliminado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al eliminar riesgo');
    },
  });

  const recalculateAllMutation = useMutation({
    mutationFn: riskService.recalculateAll,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.risks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matrix });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success(`Recálculo completado: ${result.updated} riesgos actualizados de ${result.processed} procesados`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al recalcular riesgos');
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    recalculateAll: recalculateAllMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRecalculating: recalculateAllMutation.isPending,
  };
}