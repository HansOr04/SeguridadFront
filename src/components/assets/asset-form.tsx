'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateAssetRequest } from '@/types';

const assetSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.string().min(1, 'El tipo es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  propietario: z.string().min(1, 'El propietario es requerido'),
  custodio: z.string().min(1, 'El custodio es requerido'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  valorEconomico: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  valoracion: z.object({
    confidencialidad: z.number().min(0).max(10),
    integridad: z.number().min(0).max(10),
    disponibilidad: z.number().min(0).max(10),
    autenticidad: z.number().min(0).max(10),
    trazabilidad: z.number().min(0).max(10),
  }),
});

type AssetFormData = z.infer<typeof assetSchema>;

interface AssetFormProps {
  initialData?: Partial<CreateAssetRequest>;
  onSubmit: (data: CreateAssetRequest) => void;
  isLoading?: boolean;
}

const TIPOS_ACTIVO = [
  'Hardware',
  'Software',
  'Datos/Información',
  'Comunicaciones',
  'Servicios',
  'Instalaciones',
  'Personal'
];

export function AssetForm({ initialData, onSubmit, isLoading }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      nombre: initialData?.nombre || '',
      tipo: initialData?.tipo || '',
      categoria: initialData?.categoria || '',
      propietario: initialData?.propietario || '',
      custodio: initialData?.custodio || '',
      ubicacion: initialData?.ubicacion || '',
      valorEconomico: initialData?.valorEconomico || 0,
      valoracion: {
        confidencialidad: initialData?.valoracion?.confidencialidad || 5,
        integridad: initialData?.valoracion?.integridad || 5,
        disponibilidad: initialData?.valoracion?.disponibilidad || 5,
        autenticidad: initialData?.valoracion?.autenticidad || 5,
        trazabilidad: initialData?.valoracion?.trazabilidad || 5,
      },
    },
  });

  // ✅ Obtener valores específicos del watch para evitar conflictos de tipo
  const tipoValue = watch('tipo');
  const valoracionValues = watch('valoracion');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código *</Label>
          <Input
            id="codigo"
            {...register('codigo')}
            placeholder="ACT-001"
          />
          {errors.codigo && (
            <p className="text-sm text-red-500">{errors.codigo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            value={tipoValue}
            onValueChange={(value) => setValue('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_ACTIVO.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm text-red-500">{errors.tipo.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre *</Label>
        <Input
          id="nombre"
          {...register('nombre')}
          placeholder="Nombre descriptivo del activo"
        />
        {errors.nombre && (
          <p className="text-sm text-red-500">{errors.nombre.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Input
            id="categoria"
            {...register('categoria')}
            placeholder="Categoría del activo"
          />
          {errors.categoria && (
            <p className="text-sm text-red-500">{errors.categoria.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorEconomico">Valor Económico *</Label>
          <Input
            id="valorEconomico"
            type="number"
            {...register('valorEconomico', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.valorEconomico && (
            <p className="text-sm text-red-500">{errors.valorEconomico.message}</p>
          )}
        </div>
      </div>

      {/* Responsables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="propietario">Propietario *</Label>
          <Input
            id="propietario"
            {...register('propietario')}
            placeholder="Propietario del activo"
          />
          {errors.propietario && (
            <p className="text-sm text-red-500">{errors.propietario.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="custodio">Custodio *</Label>
          <Input
            id="custodio"
            {...register('custodio')}
            placeholder="Custodio del activo"
          />
          {errors.custodio && (
            <p className="text-sm text-red-500">{errors.custodio.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacion">Ubicación *</Label>
        <Input
          id="ubicacion"
          {...register('ubicacion')}
          placeholder="Ubicación física del activo"
        />
        {errors.ubicacion && (
          <p className="text-sm text-red-500">{errors.ubicacion.message}</p>
        )}
      </div>

      {/* Valoración MAGERIT */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Valoración MAGERIT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: 'confidencialidad' as const, label: 'Confidencialidad' },
            { key: 'integridad' as const, label: 'Integridad' },
            { key: 'disponibilidad' as const, label: 'Disponibilidad' },
            { key: 'autenticidad' as const, label: 'Autenticidad' },
            { key: 'trazabilidad' as const, label: 'Trazabilidad' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`valoracion.${key}`}>
                {label}: {valoracionValues[key]} {/* ✅ Usar valoracionValues específico */}
              </Label>
              <input
                type="range"
                id={`valoracion.${key}`}
                min="0"
                max="10"
                step="1"
                {...register(`valoracion.${key}`, { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}