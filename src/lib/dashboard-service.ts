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

export const dashboardService = {
  // Obtener KPIs principales
  async getKPIs(): Promise<DashboardKPIs> {
    try {
      // Combinar múltiples endpoints para construir KPIs
      const [assetsResponse, risksResponse, vulnResponse, safeguardsResponse] = await Promise.all([
        api.get<ApiResponse>('/assets/stats'),
        api.get<ApiResponse>('/risks/dashboard'),
        api.get<ApiResponse>('/vulnerabilities/dashboard'),
        api.get<ApiResponse>('/safeguards/dashboard')
      ]);

      // ✅ Usar any con tipo explicito para evitar errores
      const assetStats: any = assetsResponse.data.data || {};
      const riskStats: any = risksResponse.data.data || {};
      const vulnStats: any = vulnResponse.data.data || {};
      const safeguardStats: any = safeguardsResponse.data.data || {};

      return {
        totalActivos: assetStats.general?.totalActivos || 0,
        riesgosCriticos: riskStats.riesgosCriticos || 0,
        vulnerabilidadesActivas: vulnStats.vulnerabilidadesActivas || 0,
        salvaguardasImplementadas: safeguardStats.implementedSafeguards || 0,
        tendenciaRiesgos: 'stable', // TODO: Calcular tendencia
        efectividadPrograma: safeguardStats.averageEffectiveness || 0
      };
    } catch (error) {
      // Fallback con datos mock si falla la API
      console.warn('Usando datos mock para KPIs:', error);
      return {
        totalActivos: 45,
        riesgosCriticos: 8,
        vulnerabilidadesActivas: 23,
        salvaguardasImplementadas: 12,
        tendenciaRiesgos: 'down',
        efectividadPrograma: 78
      };
    }
  },

  // Obtener datos para matriz de riesgos
  async getRiskMatrix(): Promise<RiskMatrixData[]> {
    try {
      const response = await api.get<ApiResponse<RiskMatrixData[]>>('/risks/matrix');
      return response.data.data || [];
    } catch (error) {
      console.warn('Usando datos mock para matriz de riesgos:', error);
      return [
        { name: 'Malware', probability: 7, impact: 8, level: 'Alto' },
        { name: 'Phishing', probability: 8, impact: 6, level: 'Alto' },
        { name: 'DDoS', probability: 4, impact: 9, level: 'Medio' },
        { name: 'Insider Threat', probability: 3, impact: 9, level: 'Medio' },
        { name: 'Data Breach', probability: 5, impact: 10, level: 'Crítico' },
      ];
    }
  },

  // Obtener datos de tendencias
  async getTrends(timeRange: '7d' | '30d' | '90d'): Promise<TrendData[]> {
    try {
      const response = await api.get<ApiResponse<TrendData[]>>(`/dashboard/trends?range=${timeRange}`);
      return response.data.data || [];
    } catch (error) {
      console.warn('Usando datos mock para tendencias:', error);
      
      // Generar datos mock basados en el rango
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const data: TrendData[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          riesgos: Math.floor(Math.random() * 20) + 10,
          vulnerabilidades: Math.floor(Math.random() * 30) + 15,
          salvaguardas: Math.floor(Math.random() * 15) + 5,
        });
      }
      
      return data;
    }
  },

  // Obtener feed de actividades
  async getActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response = await api.get<ApiResponse<Activity[]>>(`/dashboard/activities?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.warn('Usando datos mock para actividades:', error);
      
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'vulnerability',
          action: 'created',
          title: 'Nueva vulnerabilidad crítica detectada',
          description: 'VULN-2024-001: Vulnerabilidad en Apache Struts',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
          user: 'Sistema Automático',
          severity: 'critical'
        },
        {
          id: '2',
          type: 'asset',
          action: 'created',
          title: 'Nuevo servidor agregado',
          description: 'SRV-WEB-003: Servidor web de producción',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
          user: 'Juan Pérez'
        },
        {
          id: '3',
          type: 'safeguard',
          action: 'updated',
          title: 'Salvaguarda implementada',
          description: 'SAL-FW-001: Configuración de firewall actualizada',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          user: 'María González'
        },
        {
          id: '4',
          type: 'vulnerability',
          action: 'mitigated',
          title: 'Vulnerabilidad mitigada',
          description: 'VULN-2024-002: Parcheada vulnerabilidad en WordPress',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          user: 'Carlos López',
          severity: 'high'
        }
      ];

      return mockActivities.slice(0, limit);
    }
  }
};