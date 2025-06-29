// src/lib/threat-service.ts
import api from './api';
import { ApiResponse } from '@/types';

export interface Threat {
  _id: string;
  codigo: string;
  nombre: string;
  tipo: 'Natural' | 'Humana' | 'Tecnológica' | 'Ambiental';
  categoria: string;
  descripcion: string;
  origen: 'Interna' | 'Externa' | 'Mixta';
  probabilidad: number;
  vectoresAtaque: string[];
  indicadores: string[];
  vulnerabilidadesExplotadas: Array<{
    _id: string;
    codigo: string;
    nombre: string;
  }>;
  activosAfectados: Array<{
    _id: string;
    codigo: string;
    nombre: string;
    tipo: string;
  }>;
  nivelAmenaza: 'Muy Bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  estado: 'Activa' | 'Monitoreada' | 'Mitigada' | 'Descartada';
  fechaIdentificacion: string;
  fechaUltimaEvaluacion: string;
  responsable: string;
  observaciones?: string;
  cveRelacionados?: string[];
  fuentesInformacion: string[];
}

export interface CreateThreatRequest {
  codigo: string;
  nombre: string;
  tipo: 'Natural' | 'Humana' | 'Tecnológica' | 'Ambiental';
  categoria: string;
  descripcion: string;
  origen: 'Interna' | 'Externa' | 'Mixta';
  probabilidad: number;
  vectoresAtaque: string[];
  indicadores: string[];
  vulnerabilidadesExplotadas?: string[];
  activosAfectados?: string[];
  responsable: string;
  observaciones?: string;
  cveRelacionados?: string[];
  fuentesInformacion: string[];
}

export interface ThreatFilters {
  tipo?: string;
  origen?: string;
  estado?: string;
  probabilidad?: string;
  search?: string;
}

export interface ThreatStats {
  general: {
    totalAmenazas: number;
    amenazasCriticas: number;
    amenazasActivas: number;
    probabilidadPromedio: number;
  };
  porTipo: Array<{
    _id: string;
    count: number;
    probabilidadPromedio: number;
  }>;
  porOrigen: Array<{
    _id: string;
    count: number;
  }>;
  porEstado: Array<{
    _id: string;
    count: number;
  }>;
}

export const threatService = {
  // Obtener lista paginada de amenazas
  async getThreats(params: {
    page?: number;
    limit?: number;
    sort?: string;
  } & ThreatFilters): Promise<ApiResponse<Threat[]>> {
    const response = await api.get<ApiResponse<Threat[]>>('/threats', {
      params,
    });
    return response.data;
  },

  // Obtener amenaza por ID
  async getThreatById(id: string): Promise<Threat> {
    const response = await api.get<ApiResponse<Threat>>(`/threats/${id}`);
    return response.data.data!;
  },

  // Crear nueva amenaza
  async createThreat(data: CreateThreatRequest): Promise<Threat> {
    const response = await api.post<ApiResponse<Threat>>('/threats', data);
    return response.data.data!;
  },

  // Actualizar amenaza
  async updateThreat(id: string, data: Partial<CreateThreatRequest>): Promise<Threat> {
    const response = await api.put<ApiResponse<Threat>>(`/threats/${id}`, data);
    return response.data.data!;
  },

  // Eliminar amenaza
  async deleteThreat(id: string): Promise<void> {
    await api.delete(`/threats/${id}`);
  },

  // Obtener amenazas por tipo
  async getThreatsByType(tipo: string): Promise<Threat[]> {
    const response = await api.get<ApiResponse<Threat[]>>(`/threats/tipo/${tipo}`);
    return response.data.data!;
  },

  // Obtener amenaza por CVE
  async getThreatByCVE(cveId: string): Promise<Threat[]> {
    const response = await api.get<ApiResponse<Threat[]>>(`/threats/cve/${cveId}`);
    return response.data.data!;
  },

  // Importar amenazas de MAGERIT
  async importMageritThreats(): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const response = await api.post<ApiResponse<{ imported: number; skipped: number; errors: string[] }>>('/threats/magerit/import');
    return response.data.data!;
  },

  // Obtener estadísticas
  async getStats(): Promise<ThreatStats> {
    const response = await api.get<ApiResponse<ThreatStats>>('/threats/stats');
    return response.data.data!;
  },

  // Sincronizar con fuentes externas
  async syncExternalSources(): Promise<{ processed: number; updated: number; new: number }> {
    const response = await api.post<ApiResponse<{ processed: number; updated: number; new: number }>>('/threats/sync');
    return response.data.data!;
  },

  // Evaluar amenazas para un activo específico
  async evaluateForAsset(assetId: string): Promise<{
    threats: Threat[];
    riskLevel: string;
    recommendations: string[];
  }> {
    const response = await api.get<ApiResponse<{
      threats: Threat[];
      riskLevel: string;
      recommendations: string[];
    }>>(`/threats/evaluate/${assetId}`);
    return response.data.data!;
  },

  // Obtener tendencias de amenazas
  async getTrends(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(`/threats/trends?range=${timeRange}`);
    return response.data.data!;
  },
};