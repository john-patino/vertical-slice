import { useState } from 'react'
import { peticion } from '../../lib/api'

export function useDeleteProduct() {
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function eliminar(id: string): Promise<boolean> {
    setEliminando(id)
    setError(null)
    try {
      await peticion<void>(`/api/products/${id}`, { metodo: 'DELETE', slice: 'DeleteProduct' })
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible eliminar el producto.')
      return false
    } finally {
      setEliminando(null)
    }
  }

  return { eliminar, eliminando, error }
}
