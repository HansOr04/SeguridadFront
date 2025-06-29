// src/app/(dashboard)/vulnerabilidades/[id]/editar/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VulnerabilityForm } from '@/components/vulnerabilities/vulnerability-form';
import { useVulnerability, useVulnerabilityMutations } from '@/hooks/use-vulnerabilities';
import { CreateVulnerabilityRequest } from '@/types';

export default function EditVulnerabilityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: vulnerability, isLoading } = useVulnerability(id);
  const { update, isUpdating } = useVulnerabilityMutations();

  const handleSubmit = (data: CreateVulnerabilityRequest) => {
    update({ id, data }, {
      onSuccess: () => {
        router.push(`/dashboard/vulnerabilidades/${id}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!vulnerability) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Vulnerabilidad no encontrada</h2>
        <p className="text-muted-foreground mt-2">
          La vulnerabilidad que busca no existe o no tiene permisos para editarla.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/vulnerabilidades">
            Volver a Vulnerabilidades
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/vulnerabilidades/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Vulnerabilidad</h1>
          <p className="text-muted-foreground">
            Modificar información de la vulnerabilidad {vulnerability.codigo}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Vulnerabilidad</CardTitle>
          <CardDescription>
            Actualice los campos necesarios y guarde los cambios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VulnerabilityForm
            initialData={{
              codigo: vulnerability.codigo,
              nombre: vulnerability.nombre,
              categoria: vulnerability.categoria,
              descripcion: vulnerability.descripcion,
              facilidadExplotacion: vulnerability.facilidadExplotacion,
              vectoresAtaque: vulnerability.vectoresAtaque,
              afectaA: vulnerability.afectaA?.map(asset => asset._id) || [],
              amenazasRelacionadas: vulnerability.amenazasRelacionadas?.map(threat => threat._id) || [],
              estado: vulnerability.estado,
            }}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}

