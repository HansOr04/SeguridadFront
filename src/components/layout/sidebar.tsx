// src/components/layout/sidebar.tsx - NAVEGACIÓN CORREGIDA
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Shield,
  LayoutDashboard,
  FileSearch,
  AlertTriangle,
  Lock,
  Database,
  ShieldCheck,
  Bug,
  BarChart3
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard', // ✅ CORREGIDO: /dashboard en lugar de /
    icon: LayoutDashboard,
  },
  {
    name: 'Activos',
    href: '/activos',
    icon: Database,
  },
  {
    name: 'Riesgos',
    href: '/riesgos',
    icon: AlertTriangle,
  },
  {
    name: 'Amenazas',
    href: '/amenazas',
    icon: Lock,
  },
  {
    name: 'Vulnerabilidades',
    href: '/vulnerabilidades',
    icon: Bug,
  },
  {
    name: 'Salvaguardas',
    href: '/salvaguardas',
    icon: ShieldCheck,
  },
  {
    name: 'CVE',
    href: '/cve',
    icon: FileSearch,
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  // ✅ FUNCIÓN CORREGIDA para determinar si una ruta está activa
  const isRouteActive = (href: string) => {
    if (href === '/dashboard') {
      // Para dashboard, activo si está exactamente en /dashboard o subrutas
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    }
    
    // Para otras rutas, verificar si empiezan con la ruta base
    return pathname.startsWith(href);
  };

  return (
    <div className={cn('pb-12 w-64 border-r bg-card', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Logo y título */}
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <div>
              <h2 className="text-xl font-bold">SIGRISK-EC</h2>
              <p className="text-xs text-muted-foreground">Sistema MAGERIT</p>
            </div>
          </div>
          
          {/* Navegación */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = isRouteActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors group',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                    )} 
                  />
                  <span>{item.name}</span>
                  
                  {/* Indicador visual para ruta activa */}
                  {isActive && (
                    <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Footer del sidebar */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="text-xs text-muted-foreground text-center p-2 border-t">
          <p>SIGRISK-EC v1.0</p>
          <p>Metodología MAGERIT v3.0</p>
        </div>
      </div>
    </div>
  );
}