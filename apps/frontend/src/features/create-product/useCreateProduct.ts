import { useState } from 'react'
import { ApiError, peticion } from '../../lib/api'
import type { Borrador } from './validation'

interface Creado {
  id: string
  nombre: string
  sku: string
}

export function useCreateProduct() {
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)

  async function crear(borrador: Borrador): Promise<Creado | null> {
    setEnviando(true)
    setErrores({})
    setErrorGeneral(null)

    try {
      return await peticion<Creado>('/api/products', {
        metodo: 'POST',
        slice: 'CreateProduct',
        cuerpo: {
          nombre: borrador.nombre.trim(),
          sku: borrador.sku.trim(),
          categoria: borrador.categoria.trim(),
          precio: Number(borrador.precio),
          stock: Number(borrador.stock),
          descripcion: borrador.descripcion.trim(),
        },
      })
    } catch (e) {
      if (e instanceof ApiError) {
        // 400: el backend devuelve errores por campo.
        const porCampo: Record<string, string> = {}
        for (const [campo, mensajes] of Object.entries(e.errores)) {
          if (mensajes[0]) porCampo[campo] = mensajes[0]
        }

        // 409: SKU repetido. Se coloca junto al campo que lo causó.
        if (e.status === 409) porCampo.sku = e.message

        setErrores(porCampo)
        if (Object.keys(porCampo).length === 0) setErrorGeneral(e.message)
      } else {
        setErrorGeneral('No fue posible contactar la API.')
      }
      return null
    } finally {
      setEnviando(false)
    }
  }

  return { crear, enviando, errores, errorGeneral }
}
