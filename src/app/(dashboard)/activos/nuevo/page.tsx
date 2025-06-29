'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetForm } from '@/components/assets/asset-form';
import { useAssetMutations } from '@/hooks/use-assets';
import { CreateAssetRequest } from '@/types';

export default function NewAssetPage() {
  const router = useRouter();
  const { create, isCreating } = useAssetMutations();

  const handleSubmit = (data: CreateAssetRequest) => {
    create(data, {
      onSuccess: () => {
        router.push('/dashboard/activos');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nuevo Activo</h1>
        <p className="text-muted-foreground">
          Registrar un nuevo activo en el inventario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Activo</CardTitle>
          <CardDescription>
            Complete todos los campos requeridos para registrar el activo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </CardContent>
      </Card>
    </div>
  );
}