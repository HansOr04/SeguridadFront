import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getRoleDisplayName(role: string): string {
  const roles = {
    admin: 'Administrador',
    auditor: 'Auditor',
    operador: 'Operador',
    consulta: 'Consulta'
  };
  return roles[role as keyof typeof roles] || role;
}

export function getRoleBadgeColor(role: string): string {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    auditor: 'bg-blue-100 text-blue-800',
    operador: 'bg-green-100 text-green-800',
    consulta: 'bg-gray-100 text-gray-800'
  };
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}