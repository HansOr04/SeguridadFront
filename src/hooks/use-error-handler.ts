// src/hooks/use-error-handler.ts - MANEJO DE ERRORES CENTRALIZADO
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorInfo {
  message: string;
  context?: string;
  retry?: () => void;
}

export function useErrorHandler() {
  const handleApiError = (error: any, context: string = 'API') => {
    console.error(`❌ ${context} Error:`, error);

    let errorMessage = 'Error de conexión con el servidor';
    
    if (error?.response?.status === 404) {
      errorMessage = 'Recurso no encontrado - Verifique que el backend esté configurado';
    } else if (error?.response?.status === 401) {
      errorMessage = 'No autorizado - Verifique sus credenciales';
    } else if (error?.response?.status === 500) {
      errorMessage = 'Error interno del servidor';
    } else if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
      errorMessage = 'No se puede conectar al servidor - Verifique que el backend esté ejecutándose';
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast.error(`${context}: ${errorMessage}`, {
      duration: 5000,
      action: {
        label: 'Cerrar',
        onClick: () => {}
      }
    });

    return errorMessage;
  };

  const handleBackendConnection = () => {
    // Verificar si el backend está disponible
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    
    toast.info(`Conectando al backend: ${backendUrl}`, {
      duration: 3000
    });
  };

  return {
    handleApiError,
    handleBackendConnection
  };
}