// src/hooks/use-safeguards.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { safeguardService, SafeguardFilters, CreateSafeguardRequest } from '@/lib/safeguard-service';
import { toast } from 'sonner';

const QUERY_KEYS = {
  safeguards: ['safeguards'],
  safeguard: (id: string) => ['safeguard', id],
  stats: ['safeguards', 'stats'],
  effectiveness: ['safeguards', 'effectiveness'],
  dashboard: ['safeguards', 'dashboard'],
  coverage: ['safeguards', 'coverage'],
  forThreat: (threatId: string) => ['safeguards', 'threat', threatId],
  forAsset: (assetId: string) => ['safeguards', 'asset', assetId],
};

export function useSafeguards(params: {
  page?: number;
  limit?: number;
  sort?: string;
} & SafeguardFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.safeguards, params],
    queryFn: () => safeguardService.getSafeguards(params),
  });
}

export function useSafeguard(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.safeguard(id),
    queryFn: () => safeguardService.getSafeguardById(id),
    enabled: !!id,
  });
}

export function useSafeguardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => safeguardService.getStats(),
  });
}

export function useSafeguardEffectiveness() {
  return useQuery({
    queryKey: QUERY_KEYS.effectiveness,
    queryFn: () => safeguardService.getEffectiveness(),
    refetchInterval: 300000, // Refetch cada 5 minutos
  });
}

export function useSafeguardDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => safeguardService.getDashboard(),
    refetchInterval: 60000, // Refetch cada minuto
  });
}

export function useSafeguardCoverage() {
  return useQuery({
    queryKey: QUERY_KEYS.coverage,
    queryFn: () => safeguardService.evaluateCoverage(),
    refetchInterval: 600000, // Refetch cada 10 minutos
  });
}

export function useSafeguardsForThreat(threatId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.forThreat(threatId),
    queryFn: () => safeguardService.getForThreat(threatId),
    enabled: !!threatId,
  });
}

export function useSafeguardsForAsset(assetId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.forAsset(assetId),
    queryFn: () => safeguardService.getForAsset(assetId),
    enabled: !!assetId,
  });
}

export function useSafeguardMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: safeguardService.createSafeguard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.safeguards });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coverage });
      toast.success('Salvaguarda creada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear salvaguarda');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSafeguardRequest> }) =>
      safeguardService.updateSafeguard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.safeguards });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.effectiveness });
      toast.success('Salvaguarda actualizada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al actualizar salvaguarda');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: safeguardService.deleteSafeguard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.safeguards });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coverage });
      toast.success('Salvaguarda eliminada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al eliminar salvaguarda');
    },
  });

  const implementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { fechaImplementacion: string; observaciones?: string; documentacion?: string[] } }) =>
      safeguardService.implementSafeguard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.safeguards });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.effectiveness });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coverage });
      toast.success('Salvaguarda implementada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al implementar salvaguarda');
    },
  });

  const simulateEffectivenessMutation = useMutation({
    mutationFn: ({ safeguardId, scenarios }: { safeguardId: string; scenarios: Array<{ threat: string; asset: string; probability: number; impact: number }> }) =>
      safeguardService.simulateEffectiveness(safeguardId, scenarios),
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al simular efectividad');
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    implement: implementMutation.mutate,
    simulateEffectiveness: simulateEffectivenessMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isImplementing: implementMutation.isPending,
    isSimulating: simulateEffectivenessMutation.isPending,
  };
}