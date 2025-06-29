'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService } from '@/lib/asset-service';
import { AssetFilters, CreateAssetRequest } from '@/types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  assets: ['assets'],
  asset: (id: string) => ['asset', id],
  stats: ['assets', 'stats'],
  dependencies: (id: string) => ['asset', id, 'dependencies'],
};

export function useAssets(params: {
  page?: number;
  limit?: number;
  sort?: string;
} & AssetFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.assets, params],
    queryFn: () => assetService.getAssets(params),
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.asset(id),
    queryFn: () => assetService.getAssetById(id),
    enabled: !!id,
  });
}

export function useAssetStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => assetService.getStats(),
  });
}

export function useAssetMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: assetService.createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Activo creado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al crear activo');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAssetRequest> }) =>
      assetService.updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Activo actualizado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al actualizar activo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: assetService.deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Activo eliminado exitosamente');
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'Error al eliminar activo');
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}