// src/app/providers.tsx - ACTUALIZADO
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { LayoutWrapper } from './layout-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Renderizado mínimo en el servidor para evitar diferencias
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse h-8 w-8 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando...</p>
          </div>
        </div>
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
}
