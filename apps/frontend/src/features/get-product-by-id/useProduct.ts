import { useEffect, useState } from 'react'
import { ApiError, peticion } from '../../lib/api'
import type { Producto } from '../../lib/types'

/**
 * Acceso a datos del slice de detalle.
 *
 * Emite su PROPIA petición a GET /api/products/{id} en lugar de reutilizar el
 * producto que el catálogo ya tiene en memoria. Reutilizarlo sería la
 * optimización obvia, y es justo por eso que se descarta: compartir estado
 * entre vistas es razonamiento en capas disfrazado. En VSA cada slice es dueño
 * de su acceso a datos, y esa regla no deja de aplicar por cruzar al cliente.
 *
 * Además, sin esta petición el slice GetProductById del backend no tendría
 * ningún consumidor: sería código muerto que nadie ve ejecutarse.
 */
export function useProduct(id: string | null) {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [cargando, setCargando] = useState(false)
  const [noExiste, setNoExiste] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setProducto(null)
      setNoExiste(false)
      setError(null)
      return
    }

    const control = new AbortController()

    void (async () => {
      setCargando(true)
      setNoExiste(false)
      setError(null)
      try {
        const datos = await peticion<Producto>(`/api/products/${id}`, {
          slice: 'GetProductById',
          signal: control.signal,
        })
        setProducto(datos)
      } catch (e) {
        if (control.signal.aborted) return
        if (e instanceof ApiError && e.status === 404) {
          setNoExiste(true)
        } else {
          setError(e instanceof Error ? e.message : 'No fue posible cargar el detalle.')
        }
      } finally {
        if (!control.signal.aborted) setCargando(false)
      }
    })()

    return () => control.abort()
  }, [id])

  return { producto, cargando, noExiste, error }
}
