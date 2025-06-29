// src/store/auth-store.ts - CORREGIDO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      
      setAuth: (user, accessToken, refreshToken) => {
        // Guardar en localStorage también
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        console.log('🔐 Auth state updated:', { userId: user.id, email: user.email, rol: user.rol });
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
      
      clearAuth: () => {
        // Limpiar localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        console.log('🚪 Auth state cleared');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      
      setHydrated: () => {
        console.log('💧 Auth store hydrated');
        set({ isHydrated: true });
      },

      // Inicializar auth desde localStorage si es necesario
      initializeAuth: () => {
        const token = localStorage.getItem('accessToken');
        const state = get(); // ✅ Fix: obtener state completo
        const user = state.user; // ✅ Fix: acceder a user desde state
        
        if (token && user) {
          console.log('🔄 Auth initialized from storage:', { userId: user.id });
          set({ isAuthenticated: true });
        } else {
          console.log('🔄 No valid auth found in storage');
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: 'sigrisk-auth',
      onRehydrateStorage: () => (state?: AuthState) => { // ✅ Fix: parámetro opcional
        console.log('💧 Starting auth rehydration...');
        if (state) { // ✅ Fix: verificar que state existe
          state.setHydrated();
          state.initializeAuth();
        }
      },
    }
  )
);