import { useCallback, useEffect, useState } from 'react'
import { peticion } from '../../lib/api'
import type { Producto } from '../../lib/types'

/**
 * Acceso a datos de ESTE slice. Consulta GET /api/products y no sabe nada de
 * los demás casos de uso.
 */
export function useProducts() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setProductos(await peticion<Producto[]>('/api/products', { slice: 'ListProducts' }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible cargar el catálogo.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  return { productos, cargando, error, recargar: cargar }
}
