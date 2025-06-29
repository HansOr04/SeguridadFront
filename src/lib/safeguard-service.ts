// src/lib/safeguard-service.ts
import api from './api';
import { ApiResponse } from '@/types';

export interface Safeguard {
  _id: string;
  codigo: string;
  nombre: string;
  tipo: 'Preventiva' | 'Detectiva' | 'Correctiva' | 'Disuasiva';
  categoria: string;
  descripcion: string;
  objetivo: string;
  dimensiones: ('Confidencialidad' | 'Integridad' | 'Disponibilidad' | 'Autenticidad' | 'Trazabilidad')[];
  amenazasQueControla: Array<{
    _id: string;
    codigo: string;
    nombre: string;
  }>;
  activosAfectados: Array<{
    _id: string;
    codigo: string;
    nombre: string;
  }>;
  estado: 'Planificada' | 'En Implementación' | 'Implementada' | 'Operativa' | 'Obsoleta';
  efectividad: number; // 0-100%
  costoImplementacion: number;
  costoMantenimiento: number;
  responsableImplementacion: string;
  responsableMantenimiento: string;
  fechaImplementacion?: string;
  fechaUltimaRevision?: string;
  proximaRevision?: string;
  metricas: {
    incidentesPrevenidos: number;
    tiempoDeteccion: number; // en minutos
    tiempoRespuesta: number; // en minutos
    disponibilidad: number; // 0-100%
  };
  documentacion: string[];
  observaciones?: string;
  certificaciones?: string[];
}

export interface CreateSafeguardRequest {
  codigo: string;
  nombre: string;
  tipo: 'Preventiva' | 'Detectiva' | 'Correctiva' | 'Disuasiva';
  categoria: string;
  descripcion: string;
  objetivo: string;
  dimensiones: ('Confidencialidad' | 'Integridad' | 'Disponibilidad' | 'Autenticidad' | 'Trazabilidad')[];
  amenazasQueControla?: string[];
  activosAfectados?: string[];
  efectividad: number;
  costoImplementacion: number;
  costoMantenimiento: number;
  responsableImplementacion: string;
  responsableMantenimiento: string;
  proximaRevision?: string;
  documentacion?: string[];
  observaciones?: string;
  certificaciones?: string[];
}

export interface SafeguardFilters {
  tipo?: string;
  categoria?: string;
  estado?: string;
  responsable?: string;
  efectividad?: string;
  search?: string;
}

export interface SafeguardStats {
  general: {
    totalSalvaguardas: number;
    salvaguardasOperativas: number;
    efectividadPromedio: number;
    costoTotalImplementacion: number;
    costoTotalMantenimiento: number;
  };
  porTipo: Array<{
    _id: string;
    count: number;
    efectividadPromedio: number;
  }>;
  porEstado: Array<{
    _id: string;
    count: number;
  }>;
  porCategoria: Array<{
    _id: string;
    count: number;
    costoPromedio: number;
  }>;
}

export interface SafeguardEffectiveness {
  safeguard: string;
  effectiveness: number;
  coverage: number;
  incidents: {
    prevented: number;
    detected: number;
    mitigated: number;
  };
  metrics: {
    mttr: number; // Mean Time To Repair
    mtbf: number; // Mean Time Between Failures
    availability: number;
  };
}

export const safeguardService = {
  // Obtener lista paginada de salvaguardas
  async getSafeguards(params: {
    page?: number;
    limit?: number;
    sort?: string;
  } & SafeguardFilters): Promise<ApiResponse<Safeguard[]>> {
    const response = await api.get<ApiResponse<Safeguard[]>>('/safeguards', {
      params,
    });
    return response.data;
  },

  // Obtener salvaguarda por ID
  async getSafeguardById(id: string): Promise<Safeguard> {
    const response = await api.get<ApiResponse<Safeguard>>(`/safeguards/${id}`);
    return response.data.data!;
  },

  // Crear nueva salvaguarda
  async createSafeguard(data: CreateSafeguardRequest): Promise<Safeguard> {
    const response = await api.post<ApiResponse<Safeguard>>('/safeguards', data);
    return response.data.data!;
  },

  // Actualizar salvaguarda
  async updateSafeguard(id: string, data: Partial<CreateSafeguardRequest>): Promise<Safeguard> {
    const response = await api.put<ApiResponse<Safeguard>>(`/safeguards/${id}`, data);
    return response.data.data!;
  },

  // Eliminar salvaguarda
  async deleteSafeguard(id: string): Promise<void> {
    await api.delete(`/safeguards/${id}`);
  },

  // Implementar salvaguarda
  async implementSafeguard(id: string, data: {
    fechaImplementacion: string;
    observaciones?: string;
    documentacion?: string[];
  }): Promise<Safeguard> {
    const response = await api.post<ApiResponse<Safeguard>>(`/safeguards/${id}/implement`, data);
    return response.data.data!;
  },

  // Obtener efectividad de salvaguardas
  async getEffectiveness(): Promise<SafeguardEffectiveness[]> {
    const response = await api.get<ApiResponse<SafeguardEffectiveness[]>>('/safeguards/effectiveness');
    return response.data.data!;
  },

  // Obtener estadísticas
  async getStats(): Promise<SafeguardStats> {
    const response = await api.get<ApiResponse<SafeguardStats>>('/safeguards/stats');
    return response.data.data!;
  },

  // Dashboard de salvaguardas
  async getDashboard(): Promise<any> {
    const response = await api.get<ApiResponse>('/safeguards/dashboard');
    return response.data.data!;
  },

  // Evaluar cobertura de salvaguardas
  async evaluateCoverage(): Promise<{
    totalThreats: number;
    coveredThreats: number;
    coveragePercentage: number;
    uncoveredThreats: Array<{
      _id: string;
      codigo: string;
      nombre: string;
      riskLevel: string;
    }>;
    recommendations: string[];
  }> {
    const response = await api.get<ApiResponse<{
      totalThreats: number;
      coveredThreats: number;
      coveragePercentage: number;
      uncoveredThreats: Array<{
        _id: string;
        codigo: string;
        nombre: string;
        riskLevel: string;
      }>;
      recommendations: string[];
    }>>('/safeguards/coverage');
    return response.data.data!;
  },

  // Simular efectividad de salvaguarda
  async simulateEffectiveness(safeguardId: string, scenarios: Array<{
    threat: string;
    asset: string;
    probability: number;
    impact: number;
  }>): Promise<{
    originalRisk: number;
    mitigatedRisk: number;
    riskReduction: number;
    costEffectiveness: number;
  }> {
    const response = await api.post<ApiResponse<{
      originalRisk: number;
      mitigatedRisk: number;
      riskReduction: number;
      costEffectiveness: number;
    }>>(`/safeguards/${safeguardId}/simulate`, { scenarios });
    return response.data.data!;
  },

  // Obtener salvaguardas para una amenaza específica
  async getForThreat(threatId: string): Promise<Safeguard[]> {
    const response = await api.get<ApiResponse<Safeguard[]>>(`/safeguards/threat/${threatId}`);
    return response.data.data!;
  },

  // Obtener salvaguardas para un activo específico
  async getForAsset(assetId: string): Promise<Safeguard[]> {
    const response = await api.get<ApiResponse<Safeguard[]>>(`/safeguards/asset/${assetId}`);
    return response.data.data!;
  },
};