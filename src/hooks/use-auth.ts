// src/hooks/use-auth.ts - VERSIÓN FINAL con tipos correctos
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/store/auth-store';
import { LoginRequest, RegisterRequest } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Interface para error de API
interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (response) => {
      console.log('✅ Login exitoso:', response);
      
      // Verificar estructura de respuesta
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        setAuth(user, accessToken, refreshToken);
        
        toast.success('¡Bienvenido! Has iniciado sesión exitosamente.');
        router.push('/dashboard');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
      
      setIsLoading(false);
    },
    onError: (error: ApiError) => {
      console.error('❌ Error en login:', error);
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Credenciales inválidas';
      
      toast.error(errorMessage);
      clearAuth();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (response) => {
      console.log('✅ Registro exitoso:', response);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        setAuth(user, accessToken, refreshToken);
        
        toast.success('¡Registro exitoso! Tu cuenta ha sido creada.');
        router.push('/dashboard');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
      
      setIsLoading(false);
    },
    onError: (error: ApiError) => {
      console.error('❌ Error en registro:', error);
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Error al crear la cuenta';
      
      toast.error(errorMessage);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Has cerrado sesión exitosamente.');
      router.push('/login');
    },
    onError: (error: ApiError) => {
      // Aún así limpiar el estado local aunque falle el logout en el servidor
      clearAuth();
      queryClient.clear();
      router.push('/login');
      
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión, pero se ha limpiado la sesión local');
    }
  });

  return {
    user,
    isAuthenticated,
    login: (credentials: LoginRequest) => {
      console.log('🔐 Iniciando login con:', { email: credentials.email });
      loginMutation.mutate(credentials);
    },
    register: (userData: RegisterRequest) => {
      console.log('📝 Iniciando registro con:', { email: userData.email, rol: userData.rol });
      registerMutation.mutate(userData);
    },
    logout: () => {
      console.log('🚪 Cerrando sesión...');
      logoutMutation.mutate();
    },
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
}
