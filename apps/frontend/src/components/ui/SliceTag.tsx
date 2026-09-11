import type { Slice } from '../../lib/slices'

/**
 * Firma de un slice: la ruta de su carpeta en el backend y la llamada HTTP.
 *
 * Es el elemento que convierte la aplicación en material de clase — deja a la
 * vista qué carpeta del repositorio atiende lo que la persona está mirando.
 */
export function SliceTag({ slice, tamano = 'normal' }: { slice: Slice; tamano?: 'normal' | 'pequeno' }) {
  const escala = tamano === 'pequeno' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono font-medium ${escala}`}
      style={{ backgroundColor: slice.colorSuave, color: slice.color }}
    >
      <span className="font-semibold">{slice.verbo}</span>
      <span className="opacity-70">{slice.ruta}</span>
    </span>
  )
}
