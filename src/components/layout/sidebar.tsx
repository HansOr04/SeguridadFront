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
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Activos',
    href: '/dashboard/activos',
    icon: Database,
  },
  {
    name: 'Riesgos',
    href: '/dashboard/riesgos',
    icon: AlertTriangle,
  },
  {
    name: 'Amenazas',
    href: '/dashboard/amenazas',
    icon: Lock,
  },
  {
    name: 'Vulnerabilidades',
    href: '/dashboard/vulnerabilidades',
    icon: Bug,
  },
  {
    name: 'Salvaguardas',
    href: '/dashboard/salvaguardas',
    icon: ShieldCheck,
  },
  {
    name: 'CVE',
    href: '/dashboard/cve',
    icon: FileSearch,
  },
  {
    name: 'Reportes',
    href: '/dashboard/reportes',
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