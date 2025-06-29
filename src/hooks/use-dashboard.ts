// src/hooks/use-dashboard.ts - HOOKS SIN DATOS MOCK
'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/dashboard-service';
import { useErrorHandler } from './use-error-handler';

const QUERY_KEYS = {
  kpis: ['dashboard', 'kpis'],
  riskMatrix: ['dashboard', 'risk-matrix'],
  trends: (timeRange: string) => ['dashboard', 'trends', timeRange],
  activities: ['dashboard', 'activities'],
};

export function useDashboardKPIs() {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.kpis,
    queryFn: async () => {
      console.log('🔄 Fetching dashboard KPIs...');
      try {
        return await dashboardService.getKPIs();
      } catch (error) {
        handleApiError(error, 'Dashboard KPIs');
        throw error; // Re-throw para que React Query maneje el estado de error
      }
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
    retry: (failureCount, error: any) => {
      // Reintentar hasta 3 veces, pero no para errores 404 o 401
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  });
}

export function useRiskMatrix() {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.riskMatrix,
    queryFn: async () => {
      console.log('🔄 Fetching risk matrix...');
      try {
        return await dashboardService.getRiskMatrix();
      } catch (error) {
        handleApiError(error, 'Matriz de Riesgos');
        // Para matriz de riesgos, devolver array vacío en caso de error
        return [];
      }
    },
    refetchInterval: 60000, // Refetch cada minuto
    retry: 2,
  });
}

export function useTrendData(timeRange: '7d' | '30d' | '90d' = '30d') {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.trends(timeRange),
    queryFn: async () => {
      console.log(`🔄 Fetching trends for ${timeRange}...`);
      try {
        return await dashboardService.getTrends(timeRange);
      } catch (error) {
        handleApiError(error, 'Tendencias');
        // Para tendencias, devolver array vacío en caso de error
        return [];
      }
    },
    refetchInterval: 300000, // Refetch cada 5 minutos
    retry: 2,
  });
}

export function useActivityFeed(limit: number = 10) {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: [...QUERY_KEYS.activities, limit],
    queryFn: async () => {
      console.log(`🔄 Fetching ${limit} activities...`);
      try {
        return await dashboardService.getActivities(limit);
      } catch (error) {
        handleApiError(error, 'Feed de Actividades');
        // Para actividades, devolver array vacío en caso de error
        return [];
      }
    },
    refetchInterval: 15000, // Refetch cada 15 segundos
    retry: 2,
  });
}