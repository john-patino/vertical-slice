import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, ArrowRight, ServerCrash, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SliceTag } from '../../components/ui/SliceTag'
import { SLICES } from '../../lib/slices'
import { useProducts } from '../list-products/useProducts'
import { useUpdateStock } from './useUpdateStock'

export function StockAdjustmentPage() {
  const slice = SLICES.UpdateProductStock
  const { productos, cargando, error, recargar } = useProducts()
  const { ajustar, ajustando, error: errorAjuste, resultado, limpiar } = useUpdateStock()

  const [seleccionado, setSeleccionado] = useState('')
  const [ajuste, setAjuste] = useState(1)

  const producto = useMemo(
    () => productos.find((p) => p.id === seleccionado) ?? null,
    [productos, seleccionado],
  )

  useEffect(() => {
    if (!seleccionado && productos.length > 0) setSeleccionado(productos[0].id)
  }, [productos, seleccionado])

  async function aplicar() {
    if (!producto || ajuste === 0) return
    const r = await ajustar(producto.id, ajuste)
    if (r) await recargar()
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Ajuste de inventario
          </h1>
          <SliceTag slice={slice} />
        </div>
        <p className="mt-1.5 text-sm text-slate-500">
          El ajuste es un movimiento con signo, no un stock absoluto: positivo para entradas,
          negativo para salidas.
        </p>
      </header>

      {cargando && <div className="h-56 rounded-2xl border border-slate-200 bg-white" />}

      {!cargando && error && (
        <EmptyState
          icono={<ServerCrash size={22} />}
          titulo="La API no respondió"
          descripcion={error}
          accion={
            <Button color={slice.color} icono={<RefreshCw size={15} />} onClick={() => void recargar()}>
              Reintentar
            </Button>
          }
        />
      )}

      {!cargando && !error && productos.length === 0 && (
        <EmptyState
          icono={<ServerCrash size={22} />}
          titulo="No hay productos que ajustar"
          descripcion="Crea un producto antes de registrar movimientos de inventario."
        />
      )}

      {!cargando && !error && productos.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Producto
              </span>
              <select
                value={seleccionado}
                onChange={(e) => {
                  setSeleccionado(e.target.value)
                  limpiar()
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink
                           focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} · {p.sku}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Movimiento
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAjuste((v) => v - 1)}
                  aria-label="Disminuir el ajuste"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors
                             hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-amber-400"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={ajuste}
                  onChange={(e) => setAjuste(Number(e.target.value))}
                  aria-label="Cantidad del ajuste"
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2.5 text-center
                             font-display text-lg font-semibold tabular-nums text-ink
                             focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
                <button
                  onClick={() => setAjuste((v) => v + 1)}
                  aria-label="Aumentar el ajuste"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors
                             hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-amber-400"
                >
                  <Plus size={16} />
                </button>

                <Button
                  color={slice.color}
                  onClick={() => void aplicar()}
                  disabled={ajustando || ajuste === 0}
                  className="ml-auto"
                >
                  {ajustando ? 'Aplicando…' : 'Aplicar ajuste'}
                </Button>
              </div>
              {ajuste === 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  El ajuste debe ser distinto de cero.
                </p>
              )}
            </div>

            {errorAjuste && (
              <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorAjuste}
              </p>
            )}

            {resultado && (
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-amber-200
                              bg-amber-50 px-4 py-3 text-sm motion-safe:animate-[entrar_240ms_ease-out]">
                <span className="text-amber-900">{resultado.nombre}</span>
                <span className="ml-auto flex items-center gap-2 font-display font-semibold tabular-nums">
                  <span className="text-slate-400 line-through">{resultado.stockAnterior}</span>
                  <ArrowRight size={14} className="text-amber-600" />
                  <span className="text-amber-900">{resultado.stockNuevo}</span>
                </span>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Existencia actual
            </p>
            <p className="mt-2 font-display text-4xl font-semibold tabular-nums text-ink">
              {producto?.stock ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">{producto?.nombre}</p>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs leading-relaxed text-slate-500">
                La regla de stock no negativo vive dentro del slice{' '}
                <span className="font-mono text-[11px] text-amber-700">UpdateProductStock</span>, no en la
                entidad compartida: es la única operación del sistema que puede violarla.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
