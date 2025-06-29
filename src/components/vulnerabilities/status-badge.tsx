import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  estado: string;
  className?: string;
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const getStatusData = (status: string) => {
    switch (status) {
      case 'Activa':
        return { label: 'Activa', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'Mitigada':
        return { label: 'Mitigada', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'Aceptada':
        return { label: 'Aceptada', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'En Tratamiento':
        return { label: 'En Tratamiento', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const { label, color } = getStatusData(estado);

  return (
    <Badge className={cn(color, className)} variant="outline">
      {label}
    </Badge>
  );
}