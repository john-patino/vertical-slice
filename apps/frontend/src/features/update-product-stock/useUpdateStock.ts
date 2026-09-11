import { useState } from 'react'
import { ApiError, peticion } from '../../lib/api'

export interface ResultadoAjuste {
  id: string
  nombre: string
  stockAnterior: number
  stockNuevo: number
}

export function useUpdateStock() {
  const [ajustando, setAjustando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<ResultadoAjuste | null>(null)

  async function ajustar(id: string, ajuste: number): Promise<ResultadoAjuste | null> {
    setAjustando(true)
    setError(null)
    setResultado(null)

    try {
      const r = await peticion<ResultadoAjuste>(`/api/products/${id}/stock`, {
        metodo: 'PATCH',
        slice: 'UpdateProductStock',
        cuerpo: { ajuste },
      })
      setResultado(r)
      return r
    } catch (e) {
      // 422 trae el motivo y el stock disponible; se muestra tal cual.
      setError(e instanceof ApiError ? e.message : 'No fue posible aplicar el ajuste.')
      return null
    } finally {
      setAjustando(false)
    }
  }

  return { ajustar, ajustando, error, resultado, limpiar: () => { setError(null); setResultado(null) } }
}
