// API Response Types
export interface ApiResponse<T = unknown> { // ✅ unknown en lugar de any
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

export interface RefreshTokenRequest {
  refreshToken: string;
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

// Asset y Threat básicos (para referencias)
export interface Asset {
  _id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  valorEconomico: number;
}

export interface Threat {
  _id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  probabilidad: number;
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