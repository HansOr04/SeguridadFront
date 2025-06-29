import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  facilidadExplotacion: number;
  className?: string;
}

export function SeverityBadge({ facilidadExplotacion, className }: SeverityBadgeProps) {
  const getSeverityData = (score: number) => {
    if (score >= 8) return { label: 'Crítica', color: 'bg-red-100 text-red-800 border-red-200' };
    if (score >= 6) return { label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (score >= 4) return { label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 2) return { label: 'Baja', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    return { label: 'Muy Baja', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const { label, color } = getSeverityData(facilidadExplotacion);

  return (
    <Badge className={cn(color, className)} variant="outline">
      {label}
    </Badge>
  );
}