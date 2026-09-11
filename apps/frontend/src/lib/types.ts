/** Forma de un producto tal como lo devuelve el catálogo. */
export interface Producto {
  id: string
  nombre: string
  sku: string
  categoria: string
  precio: number
  stock: number
  descripcion: string
}

/** Cuerpo de error que devuelve la API (RFC 7807). */
export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}
