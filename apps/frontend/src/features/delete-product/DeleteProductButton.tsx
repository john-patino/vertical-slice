import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { SLICES } from '../../lib/slices'
import { useDeleteProduct } from './useDeleteProduct'

interface Props {
  productoId: string
  nombre: string
  onEliminado: (nombre: string) => void
}

export function DeleteProductButton({ productoId, nombre, onEliminado }: Props) {
  const slice = SLICES.DeleteProduct
  const [confirmando, setConfirmando] = useState(false)
  const { eliminar, eliminando } = useDeleteProduct()

  const enCurso = eliminando === productoId

  async function confirmar() {
    if (await eliminar(productoId)) {
      onEliminado(nombre)
    }
    setConfirmando(false)
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          variante="solido"
          color={slice.color}
          onClick={confirmar}
          disabled={enCurso}
          className="!px-2.5 !py-1 !text-xs"
        >
          {enCurso ? 'Eliminando…' : 'Confirmar'}
        </Button>
        <Button
          variante="plano"
          color="#64748B"
          onClick={() => setConfirmando(false)}
          className="!px-2 !py-1 !text-xs"
        >
          No
        </Button>
      </div>
    )
  }

  return (
    <Button
      variante="plano"
      color="#94A3B8"
      onClick={() => setConfirmando(true)}
      icono={<Trash2 size={14} />}
      className="!px-2 !py-1 !text-xs hover:!text-red-600"
      aria-label={`Eliminar ${nombre}`}
    >
      Eliminar
    </Button>
  )
}
