'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft, Shield, ShieldX, Calendar, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SeverityBadge } from '@/components/vulnerabilities/severity-badge';
import { StatusBadge } from '@/components/vulnerabilities/status-badge';
import { useVulnerability, useVulnerabilityMutations } from '@/hooks/use-vulnerabilities';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function VulnerabilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: vulnerability, isLoading } = useVulnerability(id);
  const { mitigate, reopen, isDeleting } = useVulnerabilityMutations();

  const handleMitigate = () => {
    mitigate({ 
      id, 
      data: { fechaMitigacion: new Date().toISOString() }
    });
  };

  const handleReopen = () => {
    reopen(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Cargando vulnerabilidad...</div>
      </div>
    );
  }

  if (!vulnerability) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Vulnerabilidad no encontrada</h2>
        <p className="text-muted-foreground mt-2">
          La vulnerabilidad que busca no existe o no tiene permisos para verla.
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/vulnerabilidades">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vulnerability.codigo}</h1>
            <p className="text-muted-foreground">{vulnerability.nombre}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {vulnerability.estado === 'Activa' ? (
            <Button onClick={handleMitigate}>
              <Shield className="mr-2 h-4 w-4" />
              Mitigar
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReopen}>
              <ShieldX className="mr-2 h-4 w-4" />
              Reabrir
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/dashboard/vulnerabilidades/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Principal */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Categoría</Label>
                  <p className="text-sm">{vulnerability.categoria}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <div className="mt-1">
                    <StatusBadge estado={vulnerability.estado} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                <p className="text-sm mt-1">{vulnerability.descripcion}</p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Vectores de Ataque</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vulnerability.vectoresAtaque.map((vector) => (
                    <Badge key={vector} variant="secondary">
                      {vector}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activos Afectados */}
          <Card>
            <CardHeader>
              <CardTitle>Activos Afectados</CardTitle>
              <CardDescription>
                {vulnerability.afectaA?.length || 0} activos afectados por esta vulnerabilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vulnerability.afectaA && vulnerability.afectaA.length > 0 ? (
                <div className="space-y-2">
                  {vulnerability.afectaA.map((asset) => (
                    <div key={asset._id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{asset.codigo}</p>
                        <p className="text-sm text-muted-foreground">{asset.nombre}</p>
                      </div>
                      <Badge variant="outline">{asset.tipo}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay activos afectados registrados</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Métricas */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Riesgo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {vulnerability.facilidadExplotacion}/10
                </div>
                <SeverityBadge facilidadExplotacion={vulnerability.facilidadExplotacion} />
                <p className="text-xs text-muted-foreground mt-1">
                  Facilidad de Explotación
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nivel</span>
                  <span className="text-sm font-medium">{vulnerability.nivelVulnerabilidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Activos Afectados</span>
                  <span className="text-sm font-medium">{vulnerability.afectaA?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amenazas Relacionadas</span>
                  <span className="text-sm font-medium">{vulnerability.amenazasRelacionadas?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle>Cronología</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de Detección</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(vulnerability.fechaDeteccion)}
                  </p>
                </div>
              </div>

              {vulnerability.fechaMitigacion && (
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Fecha de Mitigación</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(vulnerability.fechaMitigacion)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}