// src/lib/dashboard-service.ts - TYPESCRIPT FIXES
import api from './api';
import { ApiResponse } from '@/types';

interface DashboardKPIs {
  totalActivos: number;
  riesgosCriticos: number;
  vulnerabilidadesActivas: number;
  salvaguardasImplementadas: number;
  tendenciaRiesgos: 'up' | 'down' | 'stable';
  efectividadPrograma: number;
}

interface RiskMatrixData {
  name: string;
  probability: number;
  impact: number;
  level: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | 'Muy Bajo';
}

interface TrendData {
  date: string;
  riesgos: number;
  vulnerabilidades: number;
  salvaguardas: number;
}

interface Activity {
  id: string;
  type: 'vulnerability' | 'asset' | 'risk' | 'safeguard';
  action: 'created' | 'updated' | 'deleted' | 'mitigated';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Tipos para las respuestas del backend
interface AssetStatsResponse {
  general?: {
    totalActivos?: number;
  };
}

interface RiskStatsResponse {
  riesgosCriticos?: number;
  tendencia?: 'up' | 'down' | 'stable';
}

interface VulnerabilityStatsResponse {
  vulnerabilidadesActivas?: number;
}

interface SafeguardStatsResponse {
  implementedSafeguards?: number;
  averageEffectiveness?: number;
}

export const dashboardService = {
  // Obtener KPIs principales - SOLO BACKEND
  async getKPIs(): Promise<DashboardKPIs> {
    console.log('📊 Fetching KPIs from backend...');
    
    try {
      // Intentar combinar múltiples endpoints para construir KPIs
      const [assetsResponse, risksResponse, vulnResponse, safeguardsResponse] = await Promise.all([
        api.get<ApiResponse<AssetStatsResponse>>('/assets/stats'),
        api.get<ApiResponse<RiskStatsResponse>>('/risks/dashboard'), 
        api.get<ApiResponse<VulnerabilityStatsResponse>>('/vulnerabilities/dashboard'),
        api.get<ApiResponse<SafeguardStatsResponse>>('/safeguards/dashboard')
      ]);

      const assetStats = assetsResponse.data.data || {};
      const riskStats = risksResponse.data.data || {};
      const vulnStats = vulnResponse.data.data || {};
      const safeguardStats = safeguardsResponse.data.data || {};

      const kpis = {
        totalActivos: assetStats.general?.totalActivos || 0,
        riesgosCriticos: riskStats.riesgosCriticos || 0,
        vulnerabilidadesActivas: vulnStats.vulnerabilidadesActivas || 0,
        salvaguardasImplementadas: safeguardStats.implementedSafeguards || 0,
        tendenciaRiesgos: riskStats.tendencia || 'stable' as const,
        efectividadPrograma: safeguardStats.averageEffectiveness || 0
      };

      console.log('✅ KPIs fetched successfully:', kpis);
      return kpis;
    } catch (error) {
      console.error('❌ Error fetching KPIs from backend:', error);
      // No devolver datos mock - lanzar error para mostrar estado de error
      throw new Error('Error al cargar KPIs. Verifique que el backend esté disponible.');
    }
  },

  // Obtener datos para matriz de riesgos - SOLO BACKEND
  async getRiskMatrix(): Promise<RiskMatrixData[]> {
    console.log('🎯 Fetching risk matrix from backend...');
    
    try {
      const response = await api.get<ApiResponse<RiskMatrixData[]>>('/risks/matrix');
      const data = response.data.data || [];
      console.log('✅ Risk matrix fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching risk matrix:', error);
      // No datos mock - devolver array vacío o lanzar error
      throw new Error('Error al cargar matriz de riesgos. Verifique la conexión con el backend.');
    }
  },

  // Obtener datos de tendencias - SOLO BACKEND
  async getTrends(timeRange: '7d' | '30d' | '90d'): Promise<TrendData[]> {
    console.log(`📈 Fetching trends for ${timeRange} from backend...`);
    
    try {
      const response = await api.get<ApiResponse<TrendData[]>>(`/dashboard/trends?range=${timeRange}`);
      const data = response.data.data || [];
      console.log('✅ Trends fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching trends:', error);
      // No datos mock - devolver array vacío
      throw new Error('Error al cargar tendencias. Verifique la conexión con el backend.');
    }
  },

  // Obtener feed de actividades - SOLO BACKEND
  async getActivities(limit: number = 10): Promise<Activity[]> {
    console.log(`📝 Fetching ${limit} activities from backend...`);
    
    try {
      const response = await api.get<ApiResponse<Activity[]>>(`/dashboard/activities?limit=${limit}`);
      const data = response.data.data || [];
      console.log('✅ Activities fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      // No datos mock - devolver array vacío
      throw new Error('Error al cargar actividades. Verifique la conexión con el backend.');
    }
  }
};