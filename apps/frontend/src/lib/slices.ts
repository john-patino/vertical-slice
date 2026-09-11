/**
 * Metadatos de los cinco slices verticales.
 *
 * Existe para que la interfaz pueda NOMBRAR el slice que atiende cada acción.
 * Es andamiaje didáctico, no lógica de negocio: en una aplicación real este
 * archivo no existiría.
 */
export type SliceId =
  | 'ListProducts'
  | 'GetProductById'
  | 'CreateProduct'
  | 'UpdateProductStock'
  | 'DeleteProduct'

export interface Slice {
  id: SliceId
  carpetaBackend: string
  carpetaFrontend: string
  verbo: string
  ruta: string
  /** Cada slice tiene su color. La correspondencia se ve antes de leerse. */
  color: string
  colorSuave: string
}

export const SLICES: Record<SliceId, Slice> = {
  ListProducts: {
    id: 'ListProducts',
    carpetaBackend: 'Features/ListProducts',
    carpetaFrontend: 'features/list-products',
    verbo: 'GET',
    ruta: '/api/products',
    color: '#2563EB',
    colorSuave: '#DBEAFE',
  },
  GetProductById: {
    id: 'GetProductById',
    carpetaBackend: 'Features/GetProductById',
    carpetaFrontend: 'features/get-product-by-id',
    verbo: 'GET',
    ruta: '/api/products/{id}',
    color: '#7C3AED',
    colorSuave: '#EDE9FE',
  },
  CreateProduct: {
    id: 'CreateProduct',
    carpetaBackend: 'Features/CreateProduct',
    carpetaFrontend: 'features/create-product',
    verbo: 'POST',
    ruta: '/api/products',
    color: '#059669',
    colorSuave: '#D1FAE5',
  },
  UpdateProductStock: {
    id: 'UpdateProductStock',
    carpetaBackend: 'Features/UpdateProductStock',
    carpetaFrontend: 'features/update-product-stock',
    verbo: 'PATCH',
    ruta: '/api/products/{id}/stock',
    color: '#D97706',
    colorSuave: '#FEF3C7',
  },
  DeleteProduct: {
    id: 'DeleteProduct',
    carpetaBackend: 'Features/DeleteProduct',
    carpetaFrontend: 'features/delete-product',
    verbo: 'DELETE',
    ruta: '/api/products/{id}',
    color: '#DC2626',
    colorSuave: '#FEE2E2',
  },
}
