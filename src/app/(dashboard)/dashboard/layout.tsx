// src/app/(dashboard)/layout.tsx - SIMPLIFICAR O ELIMINAR
'use client';

// Este layout ya no es necesario porque LayoutWrapper maneja todo
// Puedes eliminar este archivo o simplificarlo:

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El LayoutWrapper ya maneja el layout del dashboard
  return <>{children}</>;
}