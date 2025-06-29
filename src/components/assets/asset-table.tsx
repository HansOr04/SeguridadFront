'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  DollarSign
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types';
import { formatDate } from '@/lib/utils';
import { useAssetMutations } from '@/hooks/use-assets';

interface AssetTableProps {
  assets: Asset[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function AssetTable({ 
  assets, 
  selectedIds, 
  onSelectionChange 
}: AssetTableProps) {
  const { delete: deleteAsset } = useAssetMutations();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(assets.map(a => a._id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este activo?')) {
      deleteAsset(id);
    }
  };

  const getCriticalityColor = (criticality: number) => {
    if (criticality >= 8) return 'bg-red-100 text-red-800';
    if (criticality >= 6) return 'bg-orange-100 text-orange-800';
    if (criticality >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getCriticalityLabel = (criticality: number) => {
    if (criticality >= 8) return 'Crítico';
    if (criticality >= 6) return 'Alto';
    if (criticality >= 4) return 'Medio';
    return 'Bajo';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === assets.length && assets.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Propietario</TableHead>
            <TableHead>Criticidad</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No se encontraron activos
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow key={asset._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(asset._id)}
                    onCheckedChange={(checked) => 
                      handleSelectOne(asset._id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link 
                    href={`/dashboard/activos/${asset._id}`}
                    className="text-primary hover:underline"
                  >
                    {asset.codigo}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={asset.nombre}>
                    {asset.nombre}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{asset.tipo}</Badge>
                </TableCell>
                <TableCell>{asset.propietario}</TableCell>
                <TableCell>
                  <Badge 
                    className={getCriticalityColor(asset.criticidad || 0)}
                    variant="outline"
                  >
                    {getCriticalityLabel(asset.criticidad || 0)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-1 h-3 w-3" />
                    {asset.valorEconomico?.toLocaleString() || '0'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(asset.fechaCreacion)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/activos/${asset._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/activos/${asset._id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(asset._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}