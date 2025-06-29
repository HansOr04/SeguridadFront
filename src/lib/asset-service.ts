import api from './api';
import { 
  ApiResponse, 
  Asset, 
  CreateAssetRequest,
  AssetFilters,
  AssetStats,
  BulkImportResult // ✅ Importar el tipo
} from '@/types';

export const assetService = {
  // Obtener lista paginada
  async getAssets(params: {
    page?: number;
    limit?: number;
    sort?: string;
  } & AssetFilters): Promise<ApiResponse<Asset[]>> {
    const response = await api.get<ApiResponse<Asset[]>>('/assets', {
      params,
    });
    return response.data;
  },

  // Obtener por ID
  async getAssetById(id: string): Promise<Asset> {
    const response = await api.get<ApiResponse<Asset>>(`/assets/${id}`);
    return response.data.data!;
  },

  // Crear nuevo activo
  async createAsset(data: CreateAssetRequest): Promise<Asset> {
    const response = await api.post<ApiResponse<Asset>>('/assets', data);
    return response.data.data!;
  },

  // Actualizar activo
  async updateAsset(id: string, data: Partial<CreateAssetRequest>): Promise<Asset> {
    const response = await api.put<ApiResponse<Asset>>(`/assets/${id}`, data);
    return response.data.data!;
  },

  // Eliminar activo
  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  // Obtener estadísticas
  async getStats(): Promise<AssetStats> {
    const response = await api.get<ApiResponse<AssetStats>>('/assets/stats');
    return response.data.data!;
  },

  // Obtener dependencias
  async getDependencies(id: string): Promise<any> {
    const response = await api.get<ApiResponse>(`/assets/${id}/dependencies`);
    return response.data.data!;
  },

  // ✅ Importación masiva - ÚNICO método
  async bulkImport(assets: CreateAssetRequest[]): Promise<BulkImportResult> {
    const response = await api.post<ApiResponse<BulkImportResult>>('/assets/bulk-import', { assets });
    return response.data.data!;
  },
};