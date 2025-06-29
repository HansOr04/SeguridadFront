// src/types/index.ts - UPDATED with missing types

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'admin' | 'auditor' | 'operador' | 'consulta';
  ultimoAcceso?: string;
  fechaCreacion: string;
  activo: boolean;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: 'admin' | 'auditor' | 'operador' | 'consulta';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Asset Types
export interface Asset {
  _id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  categoria: string;
  propietario: string;
  custodio: string;
  ubicacion: string;
  valoracion: {
    confidencialidad: number;
    integridad: number;
    disponibilidad: number;
    autenticidad: number;
    trazabilidad: number;
  };
  valorEconomico: number;
  dependencias: Asset[];
  servicios: string[];
  fechaCreacion: string;
  fechaActualizacion: string;
  criticidad?: number;
  valoracionPromedio?: number;
}

export interface CreateAssetRequest {
  codigo: string;
  nombre: string;
  tipo: string;
  categoria: string;
  propietario: string;
  custodio: string;
  ubicacion: string;
  valoracion: {
    confidencialidad: number;
    integridad: number;
    disponibilidad: number;
    autenticidad: number;
    trazabilidad: number;
  };
  valorEconomico: number;
  dependencias?: string[];
  servicios?: string[];
}

export interface AssetFilters {
  tipo?: string;
  propietario?: string;
  categoria?: string;
  search?: string;
}

export interface AssetStats {
  general: {
    totalActivos: number;
    valorTotalEconomico: number;
    criticidadPromedio: number;
  };
  porTipo: Array<{
    _id: string;
    count: number;
    valorTotal: number;
  }>;
  porCriticidad: Array<{
    _id: string;
    count: number;
  }>;
}

// Vulnerability Types
export interface Vulnerability {
  _id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  facilidadExplotacion: number;
  vectoresAtaque: string[];
  afectaA: Asset[];
  amenazasRelacionadas: Threat[];
  estado: 'Activa' | 'Mitigada' | 'Aceptada' | 'En Tratamiento';
  fechaDeteccion: string;
  fechaMitigacion?: string;
  nivelVulnerabilidad: string;
}

export interface CreateVulnerabilityRequest {
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  facilidadExplotacion: number;
  vectoresAtaque: string[];
  afectaA: string[];
  amenazasRelacionadas?: string[];
  estado?: 'Activa' | 'Mitigada' | 'Aceptada' | 'En Tratamiento';
}

export interface VulnerabilityFilters {
  categoria?: string;
  estado?: string;
  facilidad?: string;
  search?: string;
}

export interface VulnerabilityStats {
  general: {
    totalVulnerabilidades: number;
    facilidadPromedio: number;
    vulnerabilidadesCriticas: number;
    vulnerabilidadesAltas: number;
  };
  porEstado: Array<{
    _id: string;
    count: number;
  }>;
  porCategoria: Array<{
    _id: string;
    count: number;
    facilidadPromedio: number;
  }>;
}

// ✅ NEW: Risk Types
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

// ✅ NEW: Threat Types
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

// ✅ NEW: Safeguard Types
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
  efectividad: number;
  costoImplementacion: number;
  costoMantenimiento: number;
  responsableImplementacion: string;
  responsableMantenimiento: string;
  fechaImplementacion?: string;
  fechaUltimaRevision?: string;
  proximaRevision?: string;
  metricas: {
    incidentesPrevenidos: number;
    tiempoDeteccion: number;
    tiempoRespuesta: number;
    disponibilidad: number;
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

// ✅ NEW: CVE Types
export interface CVE {
  _id: string;
  cveId: string;
  description: string;
  publishedDate: string;
  lastModifiedDate: string;
  cvssV3?: {
    baseScore: number;
    baseSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    vectorString: string;
    attackVector: string;
    attackComplexity: string;
    privilegesRequired: string;
    userInteraction: string;
    scope: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
  };
  cvssV2?: {
    baseScore: number;
    baseSeverity: string;
    vectorString: string;
    accessVector: string;
    accessComplexity: string;
    authentication: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
  };
  cwe?: Array<{
    cweId: string;
    description: string;
  }>;
  references: Array<{
    url: string;
    source: string;
    tags?: string[];
  }>;
  configurations?: Array<{
    operator: string;
    cpe23Uri: string;
    versionStartIncluding?: string;
    versionEndExcluding?: string;
  }>;
  vendorComments?: Array<{
    organization: string;
    comment: string;
    lastModified: string;
  }>;
  affectedAssets?: Array<{
    _id: string;
    codigo: string;
    nombre: string;
    vulnerabilityScore: number;
  }>;
  relatedThreats?: Array<{
    _id: string;
    codigo: string;
    nombre: string;
  }>;
  status: 'Active' | 'Rejected' | 'Disputed' | 'Modified';
  sourceIdentifier: string;
}

export interface CVEFilters {
  severity?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  affectsAssets?: boolean;
  score?: {
    min: number;
    max: number;
  };
  search?: string;
}

// Dashboard Types
export interface DashboardKPIs {
  totalActivos: number;
  riesgosCriticos: number;
  vulnerabilidadesActivas: number;
  salvaguardasImplementadas: number;
  tendenciaRiesgos: 'up' | 'down' | 'stable';
  efectividadPrograma: number;
}

export interface RiskMatrixData {
  name: string;
  probability: number;
  impact: number;
  level: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | 'Muy Bajo';
}

export interface TrendData {
  date: string;
  riesgos: number;
  vulnerabilidades: number;
  salvaguardas: number;
}

export interface Activity {
  id: string;
  type: 'vulnerability' | 'asset' | 'risk' | 'safeguard';
  action: 'created' | 'updated' | 'deleted' | 'mitigated';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Bulk Import Types
export interface BulkImportResult {
  successful: number;
  failed: number;
  errors: string[];
}
