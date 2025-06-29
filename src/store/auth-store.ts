// src/store/auth-store.ts - ACTUALIZA SOLO ESTE ARCHIVO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean; // ✅ NUEVA LÍNEA
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void; // ✅ NUEVA LÍNEA
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false, // ✅ NUEVA LÍNEA
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }), // ✅ NUEVA LÍNEA
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => { // ✅ NUEVO BLOQUE
        state?.setHydrated(true);
      },
    }
  )
);