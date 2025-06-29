// src/hooks/use-cve.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cveService, CVESearchParams, CVEFilters } from '@/lib/cve-service';
import { toast } from 'sonner';

const QUERY_KEYS = {
  cves: ['cves'],
  cve: (id: string) => ['cve', id],
  search: (params: CVESearchParams) => ['cve', 'search', params],
  recent: (limit: number) => ['cve', 'recent', limit],
  stats: ['cve', 'stats'],
  syncStatus: ['cve', 'sync', 'status'],
  assetImpact: (cveId: string) => ['cve', cveId, 'impact'],
  assetCVEs: (assetId: string) => ['cve', 'asset', assetId],
  trending: (timeframe: string) => ['cve', 'trending', timeframe],
  dashboard: ['cve', 'dashboard'],
};

export function useCVESearch(params: CVESearchParams) {
  return useQuery({
    queryKey: QUERY_KEYS.search(params),
    queryFn: () => cveService.searchCVEs(params),
    enabled: !!(params.keyword || params.cveId || params.cpeMatch),
  });
}

export function useCVE(cveId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.cve(cveId),
    queryFn: () => cveService.getCVEById(cveId),
    enabled: !!cveId,
  });
}

export function useRecentCVEs(limit: number = 50) {
  return useQuery({
    queryKey: QUERY_KEYS.recent(limit),
    queryFn: () => cveService.getRecentCVEs(limit),
    refetchInterval: 300000, // Refetch cada 5 minutos
  });
}

export function useCVEStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => cveService.getStats(),
    refetchInterval: 60000, // Refetch cada minuto
  });
}

export function useSyncStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.syncStatus,
    queryFn: () => cveService.getSyncStatus(),
    refetchInterval: 5000, // Refetch cada 5 segundos cuando hay sync en progreso
  });
}

export function useCVEAssetImpact(cveId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.assetImpact(cveId),
    queryFn: () => cveService.analyzeAssetImpact(cveId),
    enabled: !!cveId,
  });
}

export function useAssetCVEs(assetId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.assetCVEs(assetId),
    queryFn: () => cveService.getCVEsForAsset(assetId),
    enabled: !!assetId,
  });
}

export function useTrendingCVEs(timeframe: '24h' | '7d' | '30d' = '7d') {
  return useQuery({
    queryKey: QUERY_KEYS.trending(timeframe),
    queryFn: () => cveService.getTrendingCVEs(timeframe),
    refetchInterval: 600000, // Refetch cada 10 minutos
  });
}

export function useCVEDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => cveService.getDashboardFeed(),
    refetchInterval: 120000, // Refetch cada 2 minutos
  });
}

export function useCVEMutations() {
  const queryClient = useQueryClient();

  const manualSyncMutation = useMutation({
    mutationFn: cveService.manualSync,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.syncStatus });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success(
        `Sincronización iniciada (Job ID: ${result.jobId}). Duración estimada: ${result.estimatedDuration} min`
      );
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al iniciar sincronización');
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: cveService.generateReport,
    onSuccess: (result) => {
      toast.success('Reporte generado exitosamente');
      // Abrir enlace de descarga
      window.open(result.downloadUrl, '_blank');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al generar reporte');
    },
  });

  const subscribeToAlertsMutation = useMutation({
    mutationFn: cveService.subscribeToAlerts,
    onSuccess: (result) => {
      toast.success(
        `Suscripción creada exitosamente (ID: ${result.subscriptionId})`
      );
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear suscripción');
    },
  });

  return {
    manualSync: manualSyncMutation.mutate,
    generateReport: generateReportMutation.mutate,
    subscribeToAlerts: subscribeToAlertsMutation.mutate,
    isManualSyncing: manualSyncMutation.isPending,
    isGeneratingReport: generateReportMutation.isPending,
    isSubscribing: subscribeToAlertsMutation.isPending,
  };
}