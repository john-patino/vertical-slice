import type { ReactNode } from 'react'

interface Props {
  icono: ReactNode
  titulo: string
  descripcion: string
  accion?: ReactNode
}

export function EmptyState({ icono, titulo, descripcion, accion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed
                    border-slate-300 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">{icono}</div>
      <h3 className="font-display text-base font-semibold text-ink">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{descripcion}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  )
}
