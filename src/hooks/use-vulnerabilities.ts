'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vulnerabilityService } from '@/lib/vulnerability-service';
import { VulnerabilityFilters, CreateVulnerabilityRequest } from '@/types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  vulnerabilities: ['vulnerabilities'],
  vulnerability: (id: string) => ['vulnerability', id],
  stats: ['vulnerabilities', 'stats'],
  critical: ['vulnerabilities', 'critical'],
  dashboard: ['vulnerabilities', 'dashboard'],
};

export function useVulnerabilities(params: {
  page?: number;
  limit?: number;
  sort?: string;
} & VulnerabilityFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.vulnerabilities, params],
    queryFn: () => vulnerabilityService.getVulnerabilities(params),
  });
}

export function useVulnerability(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.vulnerability(id),
    queryFn: () => vulnerabilityService.getVulnerabilityById(id),
    enabled: !!id,
  });
}

export function useVulnerabilityStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => vulnerabilityService.getStats(),
  });
}

export function useCriticalVulnerabilities() {
  return useQuery({
    queryKey: QUERY_KEYS.critical,
    queryFn: () => vulnerabilityService.getCriticalVulnerabilities(),
  });
}

export function useVulnerabilityMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: vulnerabilityService.createVulnerability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Vulnerabilidad creada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear vulnerabilidad');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVulnerabilityRequest> }) =>
      vulnerabilityService.updateVulnerability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Vulnerabilidad actualizada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al actualizar vulnerabilidad');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vulnerabilityService.deleteVulnerability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Vulnerabilidad eliminada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al eliminar vulnerabilidad');
    },
  });

  const mitigateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { fechaMitigacion?: string; observaciones?: string } }) =>
      vulnerabilityService.mitigate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Vulnerabilidad mitigada exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al mitigar vulnerabilidad');
    },
  });

  const reopenMutation = useMutation({
    mutationFn: vulnerabilityService.reopen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Vulnerabilidad reabierta exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al reabrir vulnerabilidad');
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: ({ action, ids, data }: { action: 'mitigate' | 'reopen' | 'delete'; ids: string[]; data?: unknown }) =>
      vulnerabilityService.bulkAction(action, ids, data),
    onSuccess: (result: { processed: number; errors: number }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success(`Acción completada: ${result.processed} procesadas, ${result.errors} errores`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error en acción masiva');
    },
  });

  const scanAssetMutation = useMutation({
    mutationFn: ({ assetId, scanType }: { assetId: string; scanType?: 'basic' | 'comprehensive' }) =>
      vulnerabilityService.scanAsset(assetId, scanType),
    onSuccess: (result: { newVulnerabilities: number; confirmedVulnerabilities: number; mitigatedVulnerabilities: number }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vulnerabilities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success(`Escaneo completado: ${result.newVulnerabilities} nuevas vulnerabilidades encontradas`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error en el escaneo');
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    mitigate: mitigateMutation.mutate,
    reopen: reopenMutation.mutate,
    bulkAction: bulkActionMutation.mutate,
    scanAsset: scanAssetMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMitigating: mitigateMutation.isPending,
    isReopening: reopenMutation.isPending,
    isBulkActioning: bulkActionMutation.isPending,
    isScanning: scanAssetMutation.isPending,
  };
}