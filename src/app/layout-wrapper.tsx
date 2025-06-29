// src/app/layout-wrapper.tsx - DISEÑO CORREGIDO
'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Rutas que no necesitan sidebar (auth pages)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Rutas que necesitan autenticación para mostrar sidebar
  const protectedRoutes = [
    '/dashboard',
    '/activos',
    '/vulnerabilidades', 
    '/riesgos',
    '/amenazas',
    '/salvaguardas',
    '/cve',
    '/reportes'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Mostrar loading hasta que esté montado e hidratado
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Inicializando SIGRISK-EC...</p>
        </div>
      </div>
    );
  }

  // Si es ruta de auth, usar layout de autenticación CORREGIDO
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="min-h-screen flex">
          {/* Panel izquierdo - Branding */}
          <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12 lg:py-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
            <div className="max-w-md mx-auto">
              {/* Logo y título */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                  SIGRISK-EC
                </h1>
                <p className="text-xl text-blue-100 mb-2">
                  Sistema de Análisis y Gestión de Riesgos
                </p>
                <p className="text-sm text-blue-200">
                  Basado en metodología MAGERIT v3.0
                </p>
              </div>
              
              {/* Características */}
              <div className="space-y-6">
                {[
                  {
                    title: 'Gestión integral de activos',
                    description: 'Inventario completo de activos de información'
                  },
                  {
                    title: 'Análisis de vulnerabilidades',
                    description: 'Detección y evaluación de amenazas'
                  },
                  {
                    title: 'Reportes automatizados',
                    description: 'Cumplimiento normativo ecuatoriano'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-blue-200">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="mt-12 pt-8 border-t border-blue-400/20">
                <div className="flex items-center justify-between text-sm text-blue-200">
                  <span>🔒 Seguridad empresarial</span>
                  <span>🛡️ Cumplimiento normativo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-6 lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si es ruta protegida y está autenticado, usar layout con sidebar
  if (isProtectedRoute && isAuthenticated) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Para rutas no protegidas o mientras carga autenticación
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

