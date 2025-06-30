// src/hooks/use-error-handler.ts - MANEJO DE ERRORES OPTIMIZADO
'use client';

import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ErrorInfo {
  message: string;
  context?: string;
  retry?: () => void;
}

// ✅ Función debounce para evitar spam de errores
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useErrorHandler() {
  const lastErrorRef = useRef<string>('');

  // ✅ Debounce para evitar errores duplicados
  const debouncedError = useCallback(
    debounce((message: string, context: string) => {
      const errorKey = `${context}:${message}`;
      
      // Evitar mostrar el mismo error múltiples veces
      if (lastErrorRef.current === errorKey) {
        return;
      }
      
      lastErrorRef.current = errorKey;
      
      toast.error(message, {
        duration: 5000,
        action: {
          label: 'Cerrar',
          onClick: () => {
            lastErrorRef.current = '';
          }
        }
      });
    }, 1000),
    []
  );

  const handleApiError = useCallback((error: any, context: string = 'API') => {
    console.error(`❌ ${context} Error:`, error);

    let errorMessage = 'Error de conexión con el servidor';
    
    // ✅ Análisis más detallado del error
    if (error?.response?.status === 404) {
      errorMessage = `${context}: Endpoint no encontrado`;
    } else if (error?.response?.status === 401) {
      errorMessage = 'Sesión expirada - Reautenticándose...';
      // No mostrar toast para 401, ya que se maneja automáticamente
      return errorMessage;
    } else if (error?.response?.status === 403) {
      errorMessage = `${context}: Sin permisos para acceder`;
    } else if (error?.response?.status === 500) {
      errorMessage = `${context}: Error interno del servidor`;
    } else if (error?.response?.status === 502) {
      errorMessage = `${context}: Servidor no disponible (502)`;
    } else if (error?.response?.status === 503) {
      errorMessage = `${context}: Servicio temporalmente no disponible`;
    } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
      errorMessage = `${context}: No se puede conectar al servidor`;
    } else if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
      errorMessage = `${context}: Tiempo de espera agotado`;
    } else if (error?.response?.data?.error) {
      errorMessage = `${context}: ${error.response.data.error}`;
    } else if (error?.message) {
      errorMessage = `${context}: ${error.message}`;
    }

    // ✅ Solo mostrar toast si no es un error de autenticación
    if (error?.response?.status !== 401) {
      debouncedError(errorMessage, context);
    }

    return errorMessage;
  }, [debouncedError]);

  const handleNetworkError = useCallback((context: string = 'Red') => {
    const message = `${context}: Verificar conexión a internet`;
    debouncedError(message, context);
    return message;
  }, [debouncedError]);

  const handleTimeoutError = useCallback((context: string = 'Timeout') => {
    const message = `${context}: La operación tardó demasiado tiempo`;
    debouncedError(message, context);
    return message;
  }, [debouncedError]);

  const handleValidationError = useCallback((errors: Record<string, string[]>, context: string = 'Validación') => {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      const message = `${context}: ${firstError}`;
      debouncedError(message, context);
      return message;
    }
    return null;
  }, [debouncedError]);

  const showSuccess = useCallback((message: string, duration: number = 3000) => {
    toast.success(message, { duration });
  }, []);

  const showInfo = useCallback((message: string, duration: number = 4000) => {
    toast.info(message, { duration });
  }, []);

  const showWarning = useCallback((message: string, duration: number = 4000) => {
    toast.warning(message, { duration });
  }, []);

  // ✅ Limpiar errores previos
  const clearErrors = useCallback(() => {
    lastErrorRef.current = '';
    toast.dismiss();
  }, []);

  return {
    handleApiError,
    handleNetworkError,
    handleTimeoutError,
    handleValidationError,
    showSuccess,
    showInfo,
    showWarning,
    clearErrors
  };
}