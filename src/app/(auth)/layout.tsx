'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Shield } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center mb-8">
            <Shield className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold">SIGRISK-EC</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Sistema de Gestión de Riesgos
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Análisis y gestión de riesgos de ciberseguridad basado en MAGERIT v3.0
          </p>
          <div className="space-y-4 text-blue-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3" />
              <span>Cumplimiento normativo ecuatoriano</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3" />
              <span>Integración con CVE/NVD</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3" />
              <span>Análisis cuantitativo de riesgos</span>
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

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}