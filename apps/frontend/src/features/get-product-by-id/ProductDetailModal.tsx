import { PackageX, RefreshCw } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { SliceTag } from '../../components/ui/SliceTag'
import { SLICES } from '../../lib/slices'
import { useProduct } from './useProduct'

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

interface Props {
  productoId: string | null
  onCerrar: () => void
  onRefrescarCatalogo: () => void
}

export function ProductDetailModal({ productoId, onCerrar, onRefrescarCatalogo }: Props) {
  const slice = SLICES.GetProductById
  const { producto, cargando, noExiste, error } = useProduct(productoId)

  return (
    <Modal
      abierto={productoId !== null}
      onCerrar={onCerrar}
      titulo={producto?.nombre ?? 'Detalle del producto'}
      color={slice.color}
      firma={<SliceTag slice={slice} tamano="pequeno" />}
    >
      {cargando && <Esqueleto />}

      {!cargando && noExiste && (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 w-fit rounded-full bg-slate-100 p-3 text-slate-400">
            <PackageX size={22} />
          </div>
          <p className="font-display text-sm font-semibold text-ink">
            Este producto ya no está disponible
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Alguien lo eliminó mientras mirabas el catálogo.
          </p>
          <Button
            variante="contorno"
            color={slice.color}
            icono={<RefreshCw size={14} />}
            className="mt-5"
            onClick={() => {
              onRefrescarCatalogo()
              onCerrar()
            }}
          >
            Refrescar catálogo
          </Button>
        </div>
      )}

      {!cargando && error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!cargando && producto && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Dato etiqueta="SKU" valor={<span className="font-mono text-xs">{producto.sku}</span>} />
            <Dato etiqueta="Categoría" valor={producto.categoria} />
            <Dato etiqueta="Precio" valor={moneda.format(producto.precio)} />
            <Dato
              etiqueta="Existencias"
              valor={
                <span className={producto.stock < 5 ? 'font-semibold text-amber-700' : undefined}>
                  {producto.stock} unidades
                </span>
              }
            />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Descripción
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {producto.descripcion || 'Este producto no tiene descripción.'}
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{etiqueta}</p>
      <p className="mt-1 text-sm text-ink">{valor}</p>
    </div>
  )
}

function Esqueleto() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-2.5 w-16 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div>
        <div className="h-2.5 w-20 rounded bg-slate-200" />
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  )
}
