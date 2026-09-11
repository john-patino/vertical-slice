import type { ProblemDetails } from './types'
import type { SliceId } from './slices'

/**
 * Error de API con la información que los formularios necesitan para colocar
 * cada mensaje junto a su campo.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Errores por campo, tal como los devuelve ValidationProblemDetails. */
    readonly errores: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** Primer mensaje asociado a un campo, o undefined si el campo está limpio. */
  campo(nombre: string): string | undefined {
    return this.errores[nombre]?.[0]
  }
}

/**
 * Registro de la última llamada de cada slice. El inspector lo lee para mostrar
 * qué slice acaba de atender la acción del usuario.
 *
 * Andamiaje didáctico: no es parte del funcionamiento del catálogo.
 */
type Observador = (slice: SliceId, verbo: string, url: string, status: number) => void
let observador: Observador | null = null
export function observarLlamadas(fn: Observador | null) {
  observador = fn
}

interface OpcionesPeticion {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  cuerpo?: unknown
  /** Slice que origina la llamada, para el inspector. */
  slice: SliceId
  signal?: AbortSignal
}

/**
 * Cliente HTTP único del proyecto. Traduce ProblemDetails a ApiError y avisa
 * al inspector de slices.
 */
export async function peticion<T>(url: string, opciones: OpcionesPeticion): Promise<T> {
  const { metodo = 'GET', cuerpo, slice, signal } = opciones

  const respuesta = await fetch(url, {
    method: metodo,
    headers: cuerpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    signal,
  })

  observador?.(slice, metodo, url, respuesta.status)

  if (respuesta.status === 204) {
    return undefined as T
  }

  if (!respuesta.ok) {
    throw await aApiError(respuesta)
  }

  return (await respuesta.json()) as T
}

async function aApiError(respuesta: Response): Promise<ApiError> {
  let problema: ProblemDetails = {}
  try {
    problema = (await respuesta.json()) as ProblemDetails
  } catch {
    // Respuesta sin cuerpo JSON: se recurre al texto de estado.
  }

  const mensaje =
    problema.detail ??
    problema.title ??
    mensajePorDefecto(respuesta.status)

  return new ApiError(respuesta.status, mensaje, problema.errors ?? {})
}

function mensajePorDefecto(status: number): string {
  if (status === 404) return 'El recurso solicitado no existe.'
  if (status === 409) return 'La operación entra en conflicto con el estado actual.'
  if (status === 422) return 'La operación incumple una regla de negocio.'
  if (status >= 500) return 'La API no está respondiendo. Revisa que el servicio esté en marcha.'
  return 'No fue posible completar la petición.'
}
