'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VulnerabilityForm } from '@/components/vulnerabilities/vulnerability-form';
import { useVulnerabilityMutations } from '@/hooks/use-vulnerabilities';
import { CreateVulnerabilityRequest } from '@/types';

export default function NewVulnerabilityPage() {
  const router = useRouter();
  const { create, isCreating } = useVulnerabilityMutations();

  const handleSubmit = (data: CreateVulnerabilityRequest) => {
    create(data, {
      onSuccess: () => {
        router.push('/dashboard/vulnerabilidades');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nueva Vulnerabilidad</h1>
        <p className="text-muted-foreground">
          Registrar una nueva vulnerabilidad en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Vulnerabilidad</CardTitle>
          <CardDescription>
            Complete todos los campos requeridos para registrar la vulnerabilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VulnerabilityForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </CardContent>
      </Card>
    </div>
  );
}