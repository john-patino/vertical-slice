import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { SliceInspector } from './SliceInspector'

export function AppLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const ubicacion = useLocation()

  // Navegar en móvil cierra el menú: quedarse abierto tapando el contenido
  // recién cargado sería un callejón sin salida.
  useEffect(() => {
    setMenuAbierto(false)
  }, [ubicacion.pathname])

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      {/* Menú permanente desde 1024px */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Menú desplegable por debajo de 1024px */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMenuAbierto(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 motion-safe:animate-[deslizar_200ms_ease-out]">
            <Sidebar onNavegar={() => setMenuAbierto(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* z-50 deja el botón de alternancia por encima del menú desplegable (z-40):
            de lo contrario el overlay lo tapa y la X queda visible pero muerta. */}
        <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-slate-200
                           bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-display text-sm font-semibold text-ink">Catálogo</span>
        </header>

        <div className="sticky top-[57px] z-20 lg:top-0">
          <SliceInspector />
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
