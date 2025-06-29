// src/components/layout/sidebar.tsx - CORREGIDO
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
    href: '/', // ✅ Ruta corregida
    icon: LayoutDashboard,
  },
  {
    name: 'Activos',
    href: '/activos', // ✅ Ruta corregida
    icon: Database,
  },
  {
    name: 'Riesgos',
    href: '/riesgos', // ✅ Ruta corregida
    icon: AlertTriangle,
  },
  {
    name: 'Amenazas',
    href: '/amenazas', // ✅ Ruta corregida
    icon: Lock,
  },
  {
    name: 'Vulnerabilidades',
    href: '/vulnerabilidades', // ✅ Ruta corregida
    icon: Bug,
  },
  {
    name: 'Salvaguardas',
    href: '/salvaguardas', // ✅ Ruta corregida
    icon: ShieldCheck,
  },
  {
    name: 'CVE',
    href: '/cve', // ✅ Ruta corregida
    icon: FileSearch,
  },
  {
    name: 'Reportes',
    href: '/reportes', // ✅ Ruta corregida
    icon: BarChart3,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

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
                  pathname === item.href
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