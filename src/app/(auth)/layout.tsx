// src/app/(auth)/layout.tsx - SIMPLIFICADO
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Shield, Loader2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redireccionar si está autenticado
  useEffect(() => {
    if (isMounted && isHydrated && isAuthenticated) {
      console.log('🔄 Usuario autenticado, redirigiendo al dashboard...');
      router.push('/dashboard');
    }
  }, [isMounted, isHydrated, isAuthenticated, router]);

  // Mostrar loading hasta que esté hidratado
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar loading mientras redirige
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Logo y título */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">SIGRISK-EC</h1>
          </div>
          
          {/* Título principal */}
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Sistema de Gestión de Riesgos
          </h2>
          
          {/* Descripción */}
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Análisis y gestión de riesgos de ciberseguridad basado en MAGERIT v3.0
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {[
              'Cumplimiento normativo ecuatoriano',
              'Integración con CVE/NVD',
              'Análisis cuantitativo de riesgos'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-12 pt-8 border-t border-blue-400/20">
            <div className="flex items-center justify-between text-sm text-blue-200">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Seguridad empresarial
              </span>
              <span>🛡️ Cumplimiento ISO 27001</span>
            </div>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="404" height="404" viewBox="0 0 404 404" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Right side - Form (SIN LOGO MÓVIL) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

