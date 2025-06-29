// src/app/(dashboard)/activos/[id]/editar/page.tsx - EDITAR ACTIVO
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetForm } from '@/components/assets/asset-form';
import { useAsset, useAssetMutations } from '@/hooks/use-assets';
import { CreateAssetRequest } from '@/types';

export default function EditAssetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: asset, isLoading } = useAsset(id);
  const { update, isUpdating } = useAssetMutations();

  const handleSubmit = (data: CreateAssetRequest) => {
    update({ id, data }, {
      onSuccess: () => {
        router.push(`/dashboard/activos/${id}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Activo no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El activo que busca no existe o no tiene permisos para editarlo.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/activos">
            Volver a Activos
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
          <Link href={`/dashboard/activos/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Activo</h1>
          <p className="text-muted-foreground">
            Modificar información del activo {asset.codigo}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Activo</CardTitle>
          <CardDescription>
            Actualice los campos necesarios y guarde los cambios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetForm
            initialData={{
              codigo: asset.codigo,
              nombre: asset.nombre,
              tipo: asset.tipo,
              categoria: asset.categoria,
              propietario: asset.propietario,
              custodio: asset.custodio,
              ubicacion: asset.ubicacion,
              valorEconomico: asset.valorEconomico,
              valoracion: asset.valoracion,
              servicios: asset.servicios || [],
            }}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}