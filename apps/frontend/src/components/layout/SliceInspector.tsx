import { useEffect, useState } from 'react'
import { SLICES, type SliceId } from '../../lib/slices'
import { observarLlamadas } from '../../lib/api'

interface Llamada {
  slice: SliceId
  verbo: string
  url: string
  status: number
  clave: number
}

/**
 * Inspector de slices: nombra el slice que atendió la última acción.
 *
 * Es el elemento que hace visible la correspondencia 1:1 entre lo que la
 * persona hace y la carpeta del backend que lo resuelve. Sin él, el demo sería
 * un CRUD más y la arquitectura quedaría solo en el discurso.
 */
export function SliceInspector() {
  const [llamada, setLlamada] = useState<Llamada | null>(null)

  useEffect(() => {
    let contador = 0
    observarLlamadas((slice, verbo, url, status) => {
      contador += 1
      setLlamada({ slice, verbo, url, status, clave: contador })
    })
    return () => observarLlamadas(null)
  }, [])

  const slice = llamada ? SLICES[llamada.slice] : null
  const fallo = llamada ? llamada.status >= 400 : false

  return (
    <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
      <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:inline">
        Slice en uso
      </span>

      {slice && llamada ? (
        <div
          key={llamada.clave}
          className="flex min-w-0 flex-1 items-center gap-2 motion-safe:animate-[entrar_240ms_ease-out]"
        >
          <span
            className="shrink-0 rounded-md px-2 py-1 font-mono text-[11px] font-semibold"
            style={{ backgroundColor: slice.colorSuave, color: slice.color }}
          >
            {slice.carpetaBackend}
          </span>
          <span className="truncate font-mono text-[11px] text-slate-500">
            {llamada.verbo} {llamada.url}
          </span>
          <span
            className="ml-auto shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
            style={{
              backgroundColor: fallo ? '#FEE2E2' : '#F1F5F9',
              color: fallo ? '#DC2626' : '#64748B',
            }}
          >
            {llamada.status}
          </span>
        </div>
      ) : (
        <span className="font-mono text-[11px] text-slate-400">
          Esperando la primera acción…
        </span>
      )}
    </div>
  )
}
