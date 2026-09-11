import { Search, X } from 'lucide-react'

interface Props {
  categorias: string[]
  categoria: string
  busqueda: string
  onCategoria: (valor: string) => void
  onBusqueda: (valor: string) => void
  resultados: number
  total: number
}

export function CatalogFilters({
  categorias,
  categoria,
  busqueda,
  onCategoria,
  onBusqueda,
  resultados,
  total,
}: Props) {
  const filtrando = categoria !== '' || busqueda !== ''

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar por nombre o SKU"
          aria-label="Buscar por nombre o SKU"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm
                     text-ink placeholder:text-slate-400 focus:border-blue-500 focus:outline-none
                     focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <select
        value={categoria}
        onChange={(e) => onCategoria(e.target.value)}
        aria-label="Filtrar por categoría"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-52"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="tabular-nums">
          {filtrando ? `${resultados} de ${total}` : `${total} productos`}
        </span>
        {filtrando && (
          <button
            onClick={() => {
              onCategoria('')
              onBusqueda('')
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500
                       transition-colors hover:bg-slate-200 hover:text-ink
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <X size={12} />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
