// src/app/page.tsx - CORREGIDO
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function HomePage() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (isAuthenticated) {
        // ✅ CORREGIDO: Redirigir a /dashboard
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  // Componente mínimo para evitar problemas de hidratación
  return null;
}