// src/hooks/use-dashboard.ts - HOOKS OPTIMIZADOS
'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/lib/dashboard-service';
import { useErrorHandler } from './use-error-handler';
import { useCallback, useMemo } from 'react';

const QUERY_KEYS = {
  kpis: ['dashboard', 'kpis'],
  riskMatrix: ['dashboard', 'risk-matrix'],
  trends: (timeRange: string) => ['dashboard', 'trends', timeRange],
  activities: (limit: number) => ['dashboard', 'activities', limit],
  health: ['dashboard', 'health'],
};

// ✅ CONFIGURACIÓN OPTIMIZADA DE QUERIES
const QUERY_CONFIG = {
  // Configuración para KPIs (datos críticos)
  kpis: {
    staleTime: 2 * 60 * 1000, // 2 minutos - datos frescos
    cacheTime: 10 * 60 * 1000, // 10 minutos en cache
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },
  
  // Configuración para matriz de riesgos (menos crítico)
  riskMatrix: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 15 * 60 * 1000, // 15 minutos en cache
    refetchInterval: 10 * 60 * 1000, // Refetch cada 10 minutos
    retry: 1,
  },
  
  // Configuración para tendencias (datos históricos)
  trends: {
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos en cache
    refetchInterval: undefined, // ✅ CORREGIDO: undefined en lugar de false
    retry: 1,
  },
  
  // Configuración para actividades (datos dinámicos)
  activities: {
    staleTime: 1 * 60 * 1000, // 1 minuto
    cacheTime: 5 * 60 * 1000, // 5 minutos en cache
    refetchInterval: 2 * 60 * 1000, // Refetch cada 2 minutos
    retry: 1,
  }
};

export function useDashboardKPIs() {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.kpis,
    queryFn: async () => {
      console.log('🔄 Fetching dashboard KPIs...');
      try {
        const data = await dashboardService.getKPIs();
        console.log('✅ KPIs loaded successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ Error loading KPIs:', error);
        handleApiError(error, 'Dashboard KPIs');
        
        // Devolver datos por defecto en lugar de lanzar error
        return {
          totalActivos: 0,
          riesgosCriticos: 0,
          vulnerabilidadesActivas: 0,
          salvaguardasImplementadas: 0,
          tendenciaRiesgos: 'stable' as const,
          efectividadPrograma: 0
        };
      }
    },
    ...QUERY_CONFIG.kpis,
  });
}

export function useRiskMatrix() {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.riskMatrix,
    queryFn: async () => {
      console.log('🔄 Fetching risk matrix...');
      try {
        const data = await dashboardService.getRiskMatrix();
        console.log('✅ Risk matrix loaded:', data.length, 'items');
        return data;
      } catch (error) {
        console.error('❌ Error loading risk matrix:', error);
        handleApiError(error, 'Matriz de Riesgos');
        return []; // Devolver array vacío para que el componente funcione
      }
    },
    ...QUERY_CONFIG.riskMatrix,
  });
}

export function useTrendData(timeRange: '7d' | '30d' | '90d' = '30d') {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.trends(timeRange),
    queryFn: async () => {
      console.log(`🔄 Fetching trends for ${timeRange}...`);
      try {
        const data = await dashboardService.getTrends(timeRange);
        console.log(`✅ Trends loaded for ${timeRange}:`, data.length, 'data points');
        return data;
      } catch (error) {
        console.error(`❌ Error loading trends for ${timeRange}:`, error);
        handleApiError(error, 'Tendencias');
        return []; // Devolver array vacío
      }
    },
    ...QUERY_CONFIG.trends,
  });
}

export function useActivityFeed(limit: number = 10) {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: QUERY_KEYS.activities(limit),
    queryFn: async () => {
      console.log(`🔄 Fetching ${limit} activities...`);
      try {
        const data = await dashboardService.getActivities(limit);
        console.log('✅ Activities loaded:', data.length, 'activities');
        return data;
      } catch (error) {
        console.error('❌ Error loading activities:', error);
        handleApiError(error, 'Feed de Actividades');
        return []; // Devolver array vacío
      }
    },
    ...QUERY_CONFIG.activities,
  });
}

// ✅ NUEVO: Hook personalizado para refetch inteligente
export function useDashboardRefresh() {
  const queryClient = useQueryClient();

  const refreshAll = useCallback(async () => {
    console.log('🔄 Refreshing all dashboard data...');
    
    // Invalidar todas las queries del dashboard
    await queryClient.invalidateQueries({ 
      queryKey: ['dashboard'],
      refetchType: 'active' // Solo refetch queries activas
    });
    
    console.log('✅ Dashboard refresh completed');
  }, [queryClient]);

  const refreshKPIs = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpis });
  }, [queryClient]);

  const refreshRiskMatrix = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.riskMatrix });
  }, [queryClient]);

  return {
    refreshAll,
    refreshKPIs,
    refreshRiskMatrix,
  };
}