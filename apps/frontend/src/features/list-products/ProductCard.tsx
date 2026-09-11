import { AlertTriangle } from 'lucide-react'
import type { Producto } from '../../lib/types'
import type { ReactNode } from 'react'

const moneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export const STOCK_BAJO = 5

interface Props {
  producto: Producto
  onVerDetalle: () => void
  acciones?: ReactNode
}

export function ProductCard({ producto, onVerDetalle, acciones }: Props) {
  const stockBajo = producto.stock < STOCK_BAJO

  return (
    <article
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5
                 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-500">
          {producto.categoria}
        </span>
        {stockBajo && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5
                           text-[10px] font-semibold text-amber-700">
            <AlertTriangle size={11} />
            Stock bajo
          </span>
        )}
      </div>

      <button
        onClick={onVerDetalle}
        className="mt-3 text-left focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-violet-400 focus-visible:ring-offset-2 rounded"
      >
        <h3 className="font-display text-base font-semibold leading-snug text-ink
                       group-hover:text-violet-700 transition-colors">
          {producto.nombre}
        </h3>
      </button>

      <p className="mt-1 font-mono text-[11px] text-slate-400">{producto.sku}</p>

      <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
        <span className="font-display text-lg font-semibold text-ink">
          {moneda.format(producto.precio)}
        </span>
        <span className={`text-xs ${stockBajo ? 'font-semibold text-amber-700' : 'text-slate-500'}`}>
          {producto.stock} en existencia
        </span>
      </div>

      {acciones && <div className="mt-4 flex items-center gap-2">{acciones}</div>}
    </article>
  )
}
