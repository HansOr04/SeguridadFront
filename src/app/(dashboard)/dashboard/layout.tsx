// src/app/(dashboard)/layout.tsx - ACTUALIZA TU ARCHIVO EXISTENTE
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isHydrated } = useAuthStore(); // ✅ AGREGAR isHydrated
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // ✅ NUEVA LÍNEA

  // ✅ NUEVO USEEFFECT
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ MODIFICAR ESTE USEEFFECT
  useEffect(() => {
    if (isMounted && isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isHydrated, isAuthenticated, router]);

  // ✅ MODIFICAR ESTA CONDICIÓN
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-card border-r">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}