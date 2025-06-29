'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/dashboard-service';

const QUERY_KEYS = {
  kpis: ['dashboard', 'kpis'],
  riskMatrix: ['dashboard', 'risk-matrix'],
  trends: (timeRange: string) => ['dashboard', 'trends', timeRange],
  activities: ['dashboard', 'activities'],
};

export function useDashboardKPIs() {
  return useQuery({
    queryKey: QUERY_KEYS.kpis,
    queryFn: dashboardService.getKPIs,
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

export function useRiskMatrix() {
  return useQuery({
    queryKey: QUERY_KEYS.riskMatrix,
    queryFn: dashboardService.getRiskMatrix,
    refetchInterval: 60000, // Refetch cada minuto
  });
}

export function useTrendData(timeRange: '7d' | '30d' | '90d' = '30d') {
  return useQuery({
    queryKey: QUERY_KEYS.trends(timeRange),
    queryFn: () => dashboardService.getTrends(timeRange),
    refetchInterval: 300000, // Refetch cada 5 minutos
  });
}

export function useActivityFeed(limit: number = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.activities, limit],
    queryFn: () => dashboardService.getActivities(limit),
    refetchInterval: 15000, // Refetch cada 15 segundos
  });
}