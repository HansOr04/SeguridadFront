// src/lib/api.ts - CLIENTE HTTP OPTIMIZADO
import axios from 'axios';

// ✅ Crear instancia de axios con configuración optimizada
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 15000, // ✅ Timeout aumentado a 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor optimizado
api.interceptors.request.use(
  (config) => {
    // Solo loggear en desarrollo para evitar spam en producción
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔗 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Agregar token de autenticación si existe
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor con mejor manejo de errores
api.interceptors.response.use(
  (response) => {
    // Solo loggear en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // ✅ Logging inteligente - solo errores importantes
    if (error.response?.status >= 500) {
      console.error(`❌ Server Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    
    const originalRequest = error.config;

    // ✅ Manejo mejorado de refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            console.log('🔄 Attempting token refresh...');
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/refresh`,
              { refreshToken },
              { timeout: 10000 } // ✅ Timeout específico para refresh
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // ✅ Actualizar tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // ✅ Reintentar request original
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            console.log('✅ Token refreshed successfully, retrying original request');
            return api(originalRequest);
            
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            
            // ✅ Limpiar storage y redirigir
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            // Solo redirigir si no estamos ya en login
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          }
        } else {
          console.log('🚪 No refresh token available, redirecting to login');
          
          // ✅ Limpiar storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          
          // Solo redirigir si no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }

    // ✅ Enriquecer error con información útil
    if (error.code === 'ECONNABORTED') {
      error.isTimeout = true;
      error.message = 'Request timeout - servidor tardó demasiado en responder';
    } else if (error.code === 'ERR_NETWORK') {
      error.isNetworkError = true;
      error.message = 'Error de red - verificar conexión a internet';
    } else if (!error.response) {
      error.isNetworkError = true;
      error.message = 'Sin respuesta del servidor - verificar que el backend esté ejecutándose';
    }

    return Promise.reject(error);
  }
);

// ✅ Función helper para verificar conectividad
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn('🔍 Connectivity check failed:', error);
    return false;
  }
};

// ✅ Función helper para obtener información del servidor
export const getServerInfo = async (): Promise<{
  status: 'online' | 'offline';
  version?: string;
  uptime?: number;
  responseTime: number;
}> => {
  const startTime = Date.now();
  
  try {
    const response = await api.get('/health', { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'online',
      version: response.data.version,
      uptime: response.data.uptime,
      responseTime
    };
  } catch (error) {
    return {
      status: 'offline',
      responseTime: Date.now() - startTime
    };
  }
};

// ✅ Configuración de timeouts específicos por tipo de request
export const createTimeoutConfig = (operation: 'fast' | 'normal' | 'slow') => {
  const timeouts = {
    fast: 5000,    // Para health checks, stats rápidas
    normal: 10000, // Para CRUD operations normales
    slow: 20000    // Para reports, bulk operations
  };
  
  return { timeout: timeouts[operation] };
};

export default api;