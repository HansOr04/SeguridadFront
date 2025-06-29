// 2. FIX: src/components/dashboard/activity-feed.tsx - Agregar import de cn
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, cn } from '@/lib/utils'; // ✅ Agregar cn
import { AlertTriangle, Shield, Plus, Edit, Trash2 } from 'lucide-react';

interface Activity {
  id: string;
  type: 'vulnerability' | 'asset' | 'risk' | 'safeguard';
  action: 'created' | 'updated' | 'deleted' | 'mitigated';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

const getActivityIcon = (type: string, action: string) => {
  if (action === 'created') return Plus;
  if (action === 'updated') return Edit;
  if (action === 'deleted') return Trash2;
  if (action === 'mitigated') return Shield;
  return AlertTriangle;
};

const getActivityColor = (type: string, action: string) => {
  if (action === 'created') return 'text-green-600';
  if (action === 'updated') return 'text-blue-600';
  if (action === 'deleted') return 'text-red-600';
  if (action === 'mitigated') return 'text-green-600';
  return 'text-orange-600';
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>
          Últimas {activities.length} acciones en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay actividad reciente
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type, activity.action);
              const color = getActivityColor(activity.type, activity.action);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={cn("p-2 rounded-full bg-muted/50", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.severity && (
                        <Badge variant={
                          activity.severity === 'critical' ? 'destructive' :
                          activity.severity === 'high' ? 'destructive' :
                          activity.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {activity.severity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(activity.timestamp)} • {activity.user}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}