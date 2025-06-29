// src/app/page.tsx - CORREGIDO para evitar problemas de hidratación
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Asegurar que el componente esté montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Solo redirigir después de la hidratación
  useEffect(() => {
    if (isMounted && isHydrated) {
      if (!isAuthenticated) {
        router.replace('/login');
      }
      // Si está autenticado, esta página actuará como el dashboard
    }
  }, [isMounted, isHydrated, isAuthenticated, router]);

  // ✅ Mostrar loading hasta que esté hidratado
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando SIGRISK-EC...</p>
        </div>
      </div>
    );
  }

  // ✅ Si no está autenticado, mostrar loading mientras redirige
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // ✅ Si está autenticado, esta página actúa como redireccionador al dashboard real
  // que está en el grupo (dashboard)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Accediendo al dashboard...</p>
      </div>
    </div>
  );
}