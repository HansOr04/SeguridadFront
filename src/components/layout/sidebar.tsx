// src/components/layout/sidebar.tsx - RUTAS CORREGIDAS
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
    href: '/', // Ruta para dashboard principal
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

  // Función para determinar si una ruta está activa
  const isRouteActive = (href: string) => {
    if (href === '/') {
      // Para dashboard, solo activo si está exactamente en "/" o no está en ninguna subruta
      return pathname === '/' || (!pathname.startsWith('/activos') && 
                                  !pathname.startsWith('/riesgos') && 
                                  !pathname.startsWith('/amenazas') && 
                                  !pathname.startsWith('/vulnerabilidades') && 
                                  !pathname.startsWith('/salvaguardas') && 
                                  !pathname.startsWith('/cve') && 
                                  !pathname.startsWith('/reportes'));
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-xl font-bold">SIGRISK-EC</h2>
          </div>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                  isRouteActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}