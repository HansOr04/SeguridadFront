// src/lib/dashboard-service.ts - SERVICIO RESILIENTE
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
interface DashboardResponse {
  totalActivos?: number;
  riesgosCriticos?: number;
  vulnerabilidadesActivas?: number;
  salvaguardasImplementadas?: number;
  tendenciaRiesgos?: 'up' | 'down' | 'stable';
  efectividadPrograma?: number;
}

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
  // ✅ MÉTODO PRINCIPAL: Intentar endpoint unificado primero
  async getKPIs(): Promise<DashboardKPIs> {
    console.log('📊 Fetching KPIs from backend...');
    
    try {
      // Intentar endpoint unificado del dashboard primero
      const response = await api.get<ApiResponse<DashboardResponse>>('/dashboard/kpis');
      
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        console.log('✅ KPIs fetched from unified endpoint:', data);
        
        return {
          totalActivos: data.totalActivos || 0,
          riesgosCriticos: data.riesgosCriticos || 0,
          vulnerabilidadesActivas: data.vulnerabilidadesActivas || 0,
          salvaguardasImplementadas: data.salvaguardasImplementadas || 0,
          tendenciaRiesgos: data.tendenciaRiesgos || 'stable',
          efectividadPrograma: data.efectividadPrograma || 0
        };
      }
      
      throw new Error('Unified endpoint returned invalid data');
      
    } catch (unifiedError) {
      console.warn('⚠️ Unified dashboard endpoint failed, trying individual endpoints:', unifiedError);
      
      // Fallback: Usar endpoints individuales con Promise.allSettled
      try {
        const results = await Promise.allSettled([
          api.get<ApiResponse<AssetStatsResponse>>('/assets/stats'),
          api.get<ApiResponse<RiskStatsResponse>>('/risks/dashboard'), 
          api.get<ApiResponse<VulnerabilityStatsResponse>>('/vulnerabilities/dashboard'),
          api.get<ApiResponse<SafeguardStatsResponse>>('/safeguards/dashboard')
        ]);

        // Extraer datos de forma segura
        const assetStats = results[0].status === 'fulfilled' ? results[0].value.data.data || {} : {};
        const riskStats = results[1].status === 'fulfilled' ? results[1].value.data.data || {} : {};
        const vulnStats = results[2].status === 'fulfilled' ? results[2].value.data.data || {} : {};
        const safeguardStats = results[3].status === 'fulfilled' ? results[3].value.data.data || {} : {};

        // Loggear qué endpoints funcionaron
        console.log('📊 Individual endpoint results:', {
          assets: results[0].status,
          risks: results[1].status,
          vulnerabilities: results[2].status,
          safeguards: results[3].status
        });

        const kpis = {
          totalActivos: assetStats.general?.totalActivos || 0,
          riesgosCriticos: riskStats.riesgosCriticos || 0,
          vulnerabilidadesActivas: vulnStats.vulnerabilidadesActivas || 0,
          salvaguardasImplementadas: safeguardStats.implementedSafeguards || 0,
          tendenciaRiesgos: riskStats.tendencia || 'stable' as const,
          efectividadPrograma: safeguardStats.averageEffectiveness || 0
        };

        console.log('✅ KPIs assembled from individual endpoints:', kpis);
        return kpis;
        
      } catch (individualError) {
        console.error('❌ All dashboard endpoints failed:', individualError);
        
        // Último fallback: datos por defecto
        return {
          totalActivos: 0,
          riesgosCriticos: 0,
          vulnerabilidadesActivas: 0,
          salvaguardasImplementadas: 0,
          tendenciaRiesgos: 'stable' as const,
          efectividadPrograma: 0
        };
      }
    }
  },

  // ✅ MATRIZ DE RIESGOS: Intentar endpoints específicos
  async getRiskMatrix(): Promise<RiskMatrixData[]> {
    console.log('🎯 Fetching risk matrix from backend...');
    
    // Array de endpoints para probar en orden de preferencia
    const endpoints = [
      '/dashboard/matrix',
      '/risks/matrix',
      '/dashboard/risk-matrix'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get<ApiResponse<RiskMatrixData[]>>(endpoint);
        const data = response.data.data || [];
        
        if (Array.isArray(data)) {
          console.log(`✅ Risk matrix fetched from ${endpoint}:`, data.length, 'items');
          return data;
        }
      } catch (error) {
        console.warn(`⚠️ Risk matrix endpoint ${endpoint} failed:`, error);
        continue;
      }
    }
    
    console.error('❌ All risk matrix endpoints failed');
    return [];
  },

  // ✅ TENDENCIAS: Con cache y timeout optimizado
  async getTrends(timeRange: '7d' | '30d' | '90d'): Promise<TrendData[]> {
    console.log(`📈 Fetching trends for ${timeRange} from backend...`);
    
    try {
      const response = await api.get<ApiResponse<TrendData[]>>(`/dashboard/trends`, {
        params: { range: timeRange },
        timeout: 8000 // Timeout específico más corto para trends
      });
      
      const data = response.data.data || [];
      console.log(`✅ Trends fetched successfully for ${timeRange}:`, data.length, 'data points');
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error(`❌ Error fetching trends for ${timeRange}:`, error);
      
      // Generar datos mínimos para que el gráfico no se rompa
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const mockData: TrendData[] = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          riesgos: 0,
          vulnerabilidades: 0,
          salvaguardas: 0
        });
      }
      
      return mockData;
    }
  },

  // ✅ ACTIVIDADES: Con paginación y filtros
  async getActivities(limit: number = 10): Promise<Activity[]> {
    console.log(`📝 Fetching ${limit} activities from backend...`);
    
    try {
      const response = await api.get<ApiResponse<Activity[]>>(`/dashboard/activities`, {
        params: { 
          limit,
          sort: '-timestamp' // Más recientes primero
        },
        timeout: 5000
      });
      
      const data = response.data.data || [];
      console.log('✅ Activities fetched successfully:', data.length, 'activities');
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      return [];
    }
  },

  // ✅ NUEVO: Método para verificar salud del dashboard
  async checkDashboardHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    services: {
      assets: boolean;
      risks: boolean;
      vulnerabilities: boolean;
      safeguards: boolean;
      dashboard: boolean;
    };
    responseTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const results = await Promise.allSettled([
        api.get('/assets/stats', { timeout: 3000 }),
        api.get('/risks/dashboard', { timeout: 3000 }),
        api.get('/vulnerabilities/dashboard', { timeout: 3000 }),
        api.get('/safeguards/dashboard', { timeout: 3000 }),
        api.get('/dashboard/kpis', { timeout: 3000 })
      ]);

      const services = {
        assets: results[0].status === 'fulfilled',
        risks: results[1].status === 'fulfilled',
        vulnerabilities: results[2].status === 'fulfilled',
        safeguards: results[3].status === 'fulfilled',
        dashboard: results[4].status === 'fulfilled'
      };

      const healthyServices = Object.values(services).filter(Boolean).length;
      const totalServices = Object.keys(services).length;
      
      let status: 'healthy' | 'degraded' | 'down';
      if (healthyServices === totalServices) {
        status = 'healthy';
      } else if (healthyServices >= totalServices / 2) {
        status = 'degraded';
      } else {
        status = 'down';
      }

      return {
        status,
        services,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'down',
        services: {
          assets: false,
          risks: false,
          vulnerabilities: false,
          safeguards: false,
          dashboard: false
        },
        responseTime: Date.now() - startTime
      };
    }
  }
};