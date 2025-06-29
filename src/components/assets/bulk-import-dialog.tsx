'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAssetMutations } from '@/hooks/use-assets';
import { CreateAssetRequest, BulkImportResult } from '@/types'; // ✅ Importar tipo

export function BulkImportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { bulkImport } = useAssetMutations();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de archivo
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert('Por favor seleccione un archivo CSV válido');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const parseCSV = (text: string): CreateAssetRequest[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const assets: CreateAssetRequest[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < headers.length) continue;
      
      try {
        const asset: CreateAssetRequest = {
          codigo: values[0] || '',
          nombre: values[1] || '',
          tipo: values[2] || '',
          categoria: values[3] || '',
          propietario: values[4] || '',
          custodio: values[5] || '',
          ubicacion: values[6] || '',
          valorEconomico: parseFloat(values[7]) || 0,
          valoracion: {
            confidencialidad: parseInt(values[8]) || 5,
            integridad: parseInt(values[9]) || 5,
            disponibilidad: parseInt(values[10]) || 5,
            autenticidad: parseInt(values[11]) || 5,
            trazabilidad: parseInt(values[12]) || 5,
          },
          servicios: values[13] ? values[13].split(';') : [],
        };
        
        assets.push(asset);
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error);
      }
    }
    
    return assets;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const text = await file.text();
      const assets = parseCSV(text);
      
      if (assets.length === 0) {
        alert('No se pudieron procesar activos del archivo CSV');
        setImporting(false);
        return;
      }

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // ✅ Usar Promise para manejar el resultado correctamente
      const importPromise = new Promise<BulkImportResult>((resolve, reject) => {
        bulkImport(assets, {
          onSuccess: (data: BulkImportResult) => {
            resolve(data);
          },
          onError: (error: any) => {
            reject(error);
          }
        });
      });

      const result = await importPromise;
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResult(result); // ✅ Ahora result es del tipo correcto
      
      // Cerrar diálogo después de mostrar resultados
      setTimeout(() => {
        setIsOpen(false);
        setFile(null);
        setResult(null);
        setProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error('Error importing assets:', error);
      alert('Error durante la importación. Verifique el formato del archivo.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      'codigo,nombre,tipo,categoria,propietario,custodio,ubicacion,valorEconomico,confidencialidad,integridad,disponibilidad,autenticidad,trazabilidad,servicios',
      'SRV-001,Servidor Web Principal,Hardware,Servidores,IT Manager,Administrador,Datacenter A,50000,8,9,9,7,6,HTTP;HTTPS',
      'SW-001,Sistema ERP,Software,Aplicaciones,CEO,IT Manager,Nube,25000,9,8,8,8,7,ERP;Contabilidad',
      'DB-001,Base de Datos Clientes,Datos/Información,Bases de Datos,DPO,DB Admin,Datacenter A,100000,10,9,8,9,9,MySQL;Backup'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_activos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importación Masiva de Activos</DialogTitle>
          <DialogDescription>
            Importe múltiples activos desde un archivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Paso 1: Descargar Plantilla</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar Plantilla CSV
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Descargue la plantilla y complete los datos de sus activos
              </p>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Paso 2: Subir Archivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={importing}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {file ? file.name : 'Seleccionar archivo CSV'}
                </Button>
                
                {file && (
                  <div className="text-xs text-muted-foreground">
                    Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          {importing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importando activos...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  {result.failed === 0 ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
                  )}
                  Resultado de Importación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Exitosos:</span>
                    <Badge variant="secondary">{result.successful}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fallidos:</span>
                    <Badge variant={result.failed > 0 ? "destructive" : "secondary"}>
                      {result.failed}
                    </Badge>
                  </div>
                  
                  {result.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Errores:</p>
                      <div className="text-xs text-red-600 space-y-1 max-h-20 overflow-y-auto">
                        {result.errors.slice(0, 3).map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                        {result.errors.length > 3 && (
                          <div>...y {result.errors.length - 3} más</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={importing}
          >
            {result ? 'Cerrar' : 'Cancelar'}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || importing || !!result}
          >
            {importing ? 'Importando...' : 'Importar Activos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}