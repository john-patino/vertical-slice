import { NavLink } from 'react-router-dom'
import { LayoutGrid, PackagePlus, SlidersHorizontal, Layers } from 'lucide-react'
import { SLICES } from '../../lib/slices'

const ENLACES = [
  { a: '/', etiqueta: 'Catálogo de productos', icono: LayoutGrid, slice: SLICES.ListProducts, exacto: true },
  { a: '/nuevo', etiqueta: 'Nuevo producto', icono: PackagePlus, slice: SLICES.CreateProduct, exacto: false },
  { a: '/inventario', etiqueta: 'Ajuste de inventario', icono: SlidersHorizontal, slice: SLICES.UpdateProductStock, exacto: false },
]

export function Sidebar({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <nav className="flex h-full flex-col bg-ink text-slate-300">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="rounded-lg bg-white/10 p-2">
          <Layers size={20} className="text-white" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-white">Catálogo</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Vertical Slice</p>
        </div>
      </div>

      <ul className="flex-1 space-y-1 px-3">
        {ENLACES.map(({ a, etiqueta, icono: Icono, slice, exacto }) => (
          <li key={a}>
            <NavLink
              to={a}
              end={exacto}
              onClick={onNavegar}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                   isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* La barra de color nombra el slice sin escribir su nombre. */}
                  <span
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r transition-opacity"
                    style={{ backgroundColor: slice.color, opacity: isActive ? 1 : 0 }}
                  />
                  <Icono size={17} style={{ color: isActive ? slice.color : undefined }} />
                  <span className="flex-1">{etiqueta}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="font-mono text-[10px] leading-relaxed text-slate-500">
          Cada acción de esta interfaz
          <br />
          invoca un slice del backend.
        </p>
      </div>
    </nav>
  )
}
