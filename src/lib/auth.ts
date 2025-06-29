// src/lib/auth.ts - SERVICIO DE AUTENTICACIÓN
import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🌐 Enviando petición de login...');
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    console.log('🌐 Respuesta de login recibida:', response.data);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🌐 Enviando petición de registro...');
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    console.log('🌐 Respuesta de registro recibida:', response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    console.log('🌐 Enviando petición de logout...');
    try {
      await api.post('/auth/logout');
      console.log('🌐 Logout exitoso en servidor');
    } catch (error) {
      console.error('🌐 Error en logout del servidor:', error);
      // No lanzar error, permitir logout local
    }
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    console.log('🔄 Renovando tokens...');
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken
    });
    console.log('🔄 Tokens renovados exitosamente');
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    console.log('👤 Obteniendo perfil de usuario...');
    const response = await api.get<ApiResponse<User>>('/auth/me');
    console.log('👤 Perfil obtenido:', response.data);
    return response.data;
  }
};