/**
 * Validación de cortesía del formulario: atrapa lo evidente antes de gastar una
 * ida al servidor. NO sustituye al validador del slice CreateProduct en el
 * backend, que es el que manda.
 */
export interface Borrador {
  nombre: string
  sku: string
  categoria: string
  precio: string
  stock: string
  descripcion: string
}

export const BORRADOR_VACIO: Borrador = {
  nombre: '',
  sku: '',
  categoria: '',
  precio: '',
  stock: '',
  descripcion: '',
}

export function validar(borrador: Borrador): Record<string, string> {
  const errores: Record<string, string> = {}

  if (borrador.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  }
  if (!/^[a-zA-Z0-9-]{3,40}$/.test(borrador.sku.trim())) {
    errores.sku = 'El SKU admite entre 3 y 40 caracteres: letras, números y guiones.'
  }
  if (borrador.categoria.trim() === '') {
    errores.categoria = 'La categoría es obligatoria.'
  }
  if (!(Number(borrador.precio) > 0)) {
    errores.precio = 'El precio debe ser mayor que cero.'
  }
  if (!Number.isInteger(Number(borrador.stock)) || Number(borrador.stock) < 0) {
    errores.stock = 'El stock debe ser un entero mayor o igual que cero.'
  }
  if (borrador.descripcion.length > 500) {
    errores.descripcion = 'La descripción admite hasta 500 caracteres.'
  }

  return errores
}
