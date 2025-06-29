// src/app/(dashboard)/activos/[id]/page.tsx - DETALLE DE ACTIVO
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft, Trash2, Download, Eye, Network } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAsset, useAssetMutations } from '@/hooks/use-assets';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: asset, isLoading } = useAsset(id);
  const { delete: deleteAsset, isDeleting } = useAssetMutations();

  const handleDelete = () => {
    if (confirm('¿Está seguro de que desea eliminar este activo? Esta acción no se puede deshacer.')) {
      deleteAsset(id, {
        onSuccess: () => {
          router.push('/dashboard/activos');
        },
      });
    }
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
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Activo no encontrado</h2>
        <p className="text-muted-foreground mt-2">
          El activo que busca no existe o no tiene permisos para verlo.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/activos">
            Volver a Activos
          </Link>
        </Button>
      </div>
    );
  }

  const getCriticalityColor = (criticality: number) => {
    if (criticality >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (criticality >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (criticality >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getCriticalityLabel = (criticality: number) => {
    if (criticality >= 8) return 'Crítico';
    if (criticality >= 6) return 'Alto';
    if (criticality >= 4) return 'Medio';
    return 'Bajo';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/activos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{asset.codigo}</h1>
            <p className="text-muted-foreground">{asset.nombre}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/activos/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Principal */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="valoracion">Valoración</TabsTrigger>
              <TabsTrigger value="dependencias">Dependencias</TabsTrigger>
              <TabsTrigger value="riesgos">Riesgos</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <Badge variant="outline">{asset.tipo}</Badge>
                    </div>
                    <div>
                      <Label>Categoría</Label>
                      <p className="text-sm">{asset.categoria}</p>
                    </div>
                    <div>
                      <Label>Propietario</Label>
                      <p className="text-sm">{asset.propietario}</p>
                    </div>
                    <div>
                      <Label>Custodio</Label>
                      <p className="text-sm">{asset.custodio}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Ubicación</Label>
                    <p className="text-sm">{asset.ubicacion}</p>
                  </div>

                  {asset.servicios && asset.servicios.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label>Servicios</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {asset.servicios.map((servicio, index) => (
                            <Badge key={index} variant="secondary">
                              {servicio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="valoracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Valoración MAGERIT</CardTitle>
                  <CardDescription>
                    Valoración de las dimensiones de seguridad (0-10)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'confidencialidad', label: 'Confidencialidad' },
                      { key: 'integridad', label: 'Integridad' },
                      { key: 'disponibilidad', label: 'Disponibilidad' },
                      { key: 'autenticidad', label: 'Autenticidad' },
                      { key: 'trazabilidad', label: 'Trazabilidad' },
                    ].map(({ key, label }) => {
                      const value = asset.valoracion[key as keyof typeof asset.valoracion];
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <Label>{label}</Label>
                            <span className="text-sm font-medium">{value}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(value / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dependencias" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dependencias</CardTitle>
                  <CardDescription>
                    Activos de los que depende y activos dependientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {asset.dependencias && asset.dependencias.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Depende de:</h4>
                      <div className="space-y-2">
                        {asset.dependencias.map((dep) => (
                          <div key={dep._id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">{dep.codigo}</p>
                              <p className="text-sm text-muted-foreground">{dep.nombre}</p>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/dashboard/activos/${dep._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay dependencias registradas</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riesgos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Riesgos Asociados</CardTitle>
                  <CardDescription>
                    Riesgos identificados para este activo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Los riesgos se mostrarán cuando se implemente el módulo de gestión de riesgos
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Métricas */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {asset.criticidad?.toFixed(1) || 'N/A'}/10
                </div>
                <Badge 
                  className={getCriticalityColor(asset.criticidad || 0)}
                  variant="outline"
                >
                  {getCriticalityLabel(asset.criticidad || 0)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Nivel de Criticidad
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Económico</span>
                  <span className="text-sm font-medium">
                    ${asset.valorEconomico?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valoración Promedio</span>
                  <span className="text-sm font-medium">
                    {asset.valoracionPromedio?.toFixed(1) || 'N/A'}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dependencias</span>
                  <span className="text-sm font-medium">
                    {asset.dependencias?.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Registro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Fecha de Creación</Label>
                <p className="text-sm font-medium">
                  {formatDateTime(asset.fechaCreacion)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Última Actualización</Label>
                <p className="text-sm font-medium">
                  {formatDateTime(asset.fechaActualizacion)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Network className="mr-2 h-4 w-4" />
                Ver Dependencias
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Analizar Riesgos
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium text-muted-foreground ${className}`}>{children}</div>;
}

