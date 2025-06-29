'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/store/auth-store';
import { LoginRequest, RegisterRequest } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ✅ Agregar interface para error de API
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export function useAuth() {
  const { user, isAuthenticated, setUser, setLoading, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Actualizar estado
      setUser(data.user);
      setLoading(false);
      
      toast.success('¡Bienvenido! Has iniciado sesión exitosamente.');
      
      router.push('/dashboard');
    },
    onError: (error: ApiError) => { // ✅ Tipo específico
      setLoading(false);
      toast.error(error.response?.data?.error || 'Credenciales inválidas');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Actualizar estado
      setUser(data.user);
      setLoading(false);
      
      toast.success('¡Registro exitoso! Tu cuenta ha sido creada.');
      
      router.push('/dashboard');
    },
    onError: (error: ApiError) => { // ✅ Tipo específico
      setLoading(false);
      toast.error(error.response?.data?.error || 'Error al crear la cuenta');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success('Has cerrado sesión exitosamente.');
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    login: (credentials: LoginRequest) => loginMutation.mutate(credentials),
    register: (userData: RegisterRequest) => registerMutation.mutate(userData),
    logout: () => logoutMutation.mutate(),
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
}