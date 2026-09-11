import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  /** Color del slice que atiende lo que ocurre dentro del modal. */
  color: string
  /** Ruta del slice, mostrada como firma del proyecto. */
  firma?: ReactNode
  children: ReactNode
}

export function Modal({ abierto, onCerrar, titulo, color, firma, children }: Props) {
  const panel = useRef<HTMLDivElement>(null)

  // Escape cierra. El catálogo de fondo conserva sus filtros porque este
  // componente no toca su estado.
  useEffect(() => {
    if (!abierto) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abierto, onCerrar])

  useEffect(() => {
    if (abierto) panel.current?.focus()
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm motion-safe:animate-[fade_150ms_ease-out]"
        onClick={onCerrar}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl
                   outline-none motion-safe:animate-[subir_200ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-2xl"
      >
        <div className="h-1 w-full rounded-t-2xl" style={{ backgroundColor: color }} />
        <header className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{titulo}</h2>
            {firma && <div className="mt-1">{firma}</div>}
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <X size={18} />
          </button>
        </header>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}
