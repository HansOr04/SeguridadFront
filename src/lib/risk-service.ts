// src/lib/risk-service.ts
import api from './api';
import { ApiResponse } from '@/types';

export interface Risk {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: {
    _id: string;
    codigo: string;
    nombre: string;
  };
  amenaza: {
    _id: string;
    codigo: string;
    nombre: string;
  };
  vulnerabilidad?: {
    _id: string;
    codigo: string;
    nombre: string;
  };
  probabilidad: number;
  impacto: number;
  riesgoInherente: number;
  salvaguardas: Array<{
    _id: string;
    codigo: string;
    nombre: string;
    efectividad: number;
  }>;
  riesgoResidual: number;
  nivelRiesgo: 'Muy Bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  estado: 'Identificado' | 'En Análisis' | 'Tratado' | 'Aceptado' | 'Transferido';
  fechaIdentificacion: string;
  fechaUltimaEvaluacion: string;
  responsable: string;
  tratamiento: 'Evitar' | 'Mitigar' | 'Transferir' | 'Aceptar';
}

export interface CreateRiskRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: string;
  amenaza: string;
  vulnerabilidad?: string;
  probabilidad: number;
  impacto: number;
  salvaguardas?: string[];
  responsable: string;
  tratamiento: 'Evitar' | 'Mitigar' | 'Transferir' | 'Aceptar';
}

export interface RiskFilters {
  nivel?: string;
  estado?: string;
  tratamiento?: string;
  activo?: string;
  search?: string;
}

export interface RiskCalculationRequest {
  activo: string;
  amenaza: string;
  vulnerabilidad?: string;
  probabilidad: number;
  impacto: number;
  salvaguardas?: Array<{
    salvaguarda: string;
    efectividad: number;
  }>;
}

export interface RiskCalculationResult {
  riesgoInherente: number;
  riesgoResidual: number;
  nivelRiesgoInherente: string;
  nivelRiesgoResidual: string;
  recomendaciones: string[];
}

export interface RiskStats {
  general: {
    totalRiesgos: number;
    riesgosCriticos: number;
    riesgosAltos: number;
    riesgoPromedio: number;
  };
  porNivel: Array<{
    _id: string;
    count: number;
  }>;
  porEstado: Array<{
    _id: string;
    count: number;
  }>;
  porTratamiento: Array<{
    _id: string;
    count: number;
  }>;
}

export const riskService = {
  // Obtener lista paginada de riesgos
  async getRisks(params: {
    page?: number;
    limit?: number;
    sort?: string;
  } & RiskFilters): Promise<ApiResponse<Risk[]>> {
    const response = await api.get<ApiResponse<Risk[]>>('/risks', {
      params,
    });
    return response.data;
  },

  // Obtener riesgo por ID
  async getRiskById(id: string): Promise<Risk> {
    const response = await api.get<ApiResponse<Risk>>(`/risks/${id}`);
    return response.data.data!;
  },

  // Crear nuevo riesgo
  async createRisk(data: CreateRiskRequest): Promise<Risk> {
    const response = await api.post<ApiResponse<Risk>>('/risks', data);
    return response.data.data!;
  },

  // Actualizar riesgo
  async updateRisk(id: string, data: Partial<CreateRiskRequest>): Promise<Risk> {
    const response = await api.put<ApiResponse<Risk>>(`/risks/${id}`, data);
    return response.data.data!;
  },

  // Eliminar riesgo
  async deleteRisk(id: string): Promise<void> {
    await api.delete(`/risks/${id}`);
  },

  // Calcular riesgo
  async calculateRisk(data: RiskCalculationRequest): Promise<RiskCalculationResult> {
    const response = await api.post<ApiResponse<RiskCalculationResult>>('/risks/calculate', data);
    return response.data.data!;
  },

  // Recalcular todos los riesgos
  async recalculateAll(): Promise<{ processed: number; updated: number }> {
    const response = await api.post<ApiResponse<{ processed: number; updated: number }>>('/risks/recalculate-all');
    return response.data.data!;
  },

  // Obtener matriz de riesgos
  async getRiskMatrix(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>('/risks/matrix');
    return response.data.data!;
  },

  // Obtener top riesgos
  async getTopRisks(limit: number = 10): Promise<Risk[]> {
    const response = await api.get<ApiResponse<Risk[]>>(`/risks/top/${limit}`);
    return response.data.data!;
  },

  // Obtener estadísticas
  async getStats(): Promise<RiskStats> {
    const response = await api.get<ApiResponse<RiskStats>>('/risks/stats');
    return response.data.data!;
  },

  // Dashboard de riesgos
  async getDashboard(): Promise<any> {
    const response = await api.get<ApiResponse>('/risks/dashboard');
    return response.data.data!;
  },
};