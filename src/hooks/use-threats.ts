// src/hooks/use-threats.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threatService, ThreatFilters, CreateThreatRequest } from '@/lib/threat-service';
import { toast } from 'sonner';

const QUERY_KEYS = {
  threats: ['threats'],
  threat: (id: string) => ['threat', id],
  stats: ['threats', 'stats'],
  byType: (type: string) => ['threats', 'type', type],
  byCVE: (cveId: string) => ['threats', 'cve', cveId],
  evaluation: (assetId: string) => ['threats', 'evaluation', assetId],
  trends: (timeRange: string) => ['threats', 'trends', timeRange],
};

export function useThreats(params: {
  page?: number;
  limit?: number;
  sort?: string;
} & ThreatFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.threats, params],
    queryFn: () => threatService.getThreats(params),
  });
}

export function useThreat(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.threat(id),
    queryFn: () => threatService.getThreatById(id),
    enabled: !!id,
  });
}

export function useThreatStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => threatService.getStats(),
  });
}

export function useThreatsByType(type: string) {
  return useQuery({
    queryKey: QUERY_KEYS.byType(type),
    queryFn: () => threatService.getThreatsByType(type),
    enabled: !!type,
  });
}

export function useThreatByCVE(cveId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.byCVE(cveId),
    queryFn: () => threatService.getThreatByCVE(cveId),
    enabled: !!cveId,
  });
}

export function useThreatEvaluation(assetId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.evaluation(assetId),
    queryFn: () => threatService.evaluateForAsset(assetId),
    enabled: !!assetId,
  });
}

export function useThreatTrends(timeRange: '7d' | '30d' | '90d' = '30d') {
  return useQuery({
    queryKey: QUERY_KEYS.trends(timeRange),
    queryFn: () => threatService.getTrends(timeRange),
  });
}

export function useThreatMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: threatService.createThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Amenaza creada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear amenaza');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateThreatRequest> }) =>
      threatService.updateThreat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Amenaza actualizada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al actualizar amenaza');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: threatService.deleteThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Amenaza eliminada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al eliminar amenaza');
    },
  });

  const importMageritMutation = useMutation({
    mutationFn: threatService.importMageritThreats,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success(
        `Importación MAGERIT completada: ${result.imported} importadas, ${result.skipped} omitidas`
      );
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error en la importación MAGERIT');
    },
  });

  const syncExternalMutation = useMutation({
    mutationFn: threatService.syncExternalSources,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success(
        `Sincronización completada: ${result.new} nuevas, ${result.updated} actualizadas`
      );
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error en la sincronización');
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    importMagerit: importMageritMutation.mutate,
    syncExternal: syncExternalMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isImporting: importMageritMutation.isPending,
    isSyncing: syncExternalMutation.isPending,
  };
}