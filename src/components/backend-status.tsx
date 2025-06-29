// src/components/backend-status.tsx
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock,
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

type BackendStatusType = 'online' | 'offline' | 'checking' | 'error';

interface StatusInfo {
  status: BackendStatusType;
  lastCheck: Date;
  responseTime?: number;
  version?: string;
  uptime?: string;
}

export function BackendStatus() {
  const [statusInfo, setStatusInfo] = useState<StatusInfo>({
    status: 'checking',
    lastCheck: new Date()
  });

  const checkBackendStatus = async () => {
    setStatusInfo(prev => ({ ...prev, status: 'checking' }));
    
    const startTime = Date.now();
    
    try {
      const response = await api.get('/health', {
        timeout: 5000 // 5 segundos timeout
      });
      
      const responseTime = Date.now() - startTime;
      const healthData = response.data;
      
      setStatusInfo({
        status: 'online',
        lastCheck: new Date(),
        responseTime,
        version: healthData.version,
        uptime: healthData.uptime
      });
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      setStatusInfo({
        status: 'offline',
        lastCheck: new Date(),
        responseTime: undefined,
        version: undefined,
        uptime: undefined
      });
    }
  };

  // Check inicial y cada 30 segundos
  useEffect(() => {
    checkBackendStatus();
    
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (statusInfo.status) {
      case 'online':
        return {
          icon: Wifi,
          text: 'Conectado',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-100 hover:bg-green-200'
        };
      case 'offline':
        return {
          icon: WifiOff,
          text: 'Desconectado',
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-100 hover:bg-red-200'
        };
      case 'checking':
        return {
          icon: RefreshCw,
          text: 'Verificando...',
          variant: 'secondary' as const,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 hover:bg-blue-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          variant: 'destructive' as const,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 hover:bg-orange-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatLastCheck = () => {
    const now = new Date();
    const diff = now.getTime() - statusInfo.lastCheck.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `hace ${seconds}s`;
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
    return `hace ${Math.floor(seconds / 3600)}h`;
  };

  const getTooltipContent = () => {
    return (
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Estado:</span>
          <span className={cn("font-medium", config.color)}>
            {config.text}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Última verificación:</span>
          <span>{formatLastCheck()}</span>
        </div>
        
        {statusInfo.responseTime && (
          <div className="flex items-center justify-between">
            <span>Tiempo de respuesta:</span>
            <span>{statusInfo.responseTime}ms</span>
          </div>
        )}
        
        {statusInfo.version && (
          <div className="flex items-center justify-between">
            <span>Versión:</span>
            <span>{statusInfo.version}</span>
          </div>
        )}
        
        {statusInfo.uptime && (
          <div className="flex items-center justify-between">
            <span>Tiempo activo:</span>
            <span>{statusInfo.uptime}</span>
          </div>
        )}
        
        <div className="pt-1 border-t">
          <span className="text-muted-foreground">
            Click para verificar manualmente
          </span>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkBackendStatus}
            disabled={statusInfo.status === 'checking'}
            className={cn(
              "h-7 px-2 text-xs font-medium transition-colors",
              config.bgColor
            )}
          >
            <Icon 
              className={cn(
                "h-3 w-3 mr-1.5",
                config.color,
                statusInfo.status === 'checking' && "animate-spin"
              )} 
            />
            {config.text}
            
            {statusInfo.responseTime && statusInfo.status === 'online' && (
              <span className="ml-1 text-muted-foreground">
                ({statusInfo.responseTime}ms)
              </span>
            )}
          </Button>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}