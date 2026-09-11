import { useState } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { SliceTag } from '../../components/ui/SliceTag'
import { SLICES } from '../../lib/slices'
import { useCreateProduct } from './useCreateProduct'
import { BORRADOR_VACIO, validar, type Borrador } from './validation'

interface Props {
  abierto: boolean
  onCerrar: () => void
  onCreado: (nombre: string) => void
}

export function CreateProductModal({ abierto, onCerrar, onCreado }: Props) {
  const slice = SLICES.CreateProduct
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO)
  const [erroresLocales, setErroresLocales] = useState<Record<string, string>>({})
  const { crear, enviando, errores: erroresServidor, errorGeneral } = useCreateProduct()

  const errores = { ...erroresLocales, ...erroresServidor }

  function actualizar(campo: keyof Borrador, valor: string) {
    setBorrador((b) => ({ ...b, [campo]: valor }))
    setErroresLocales((e) => {
      const { [campo]: _descartado, ...resto } = e
      return resto
    })
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()

    const locales = validar(borrador)
    if (Object.keys(locales).length > 0) {
      setErroresLocales(locales)
      return
    }

    const creado = await crear(borrador)
    if (creado) {
      // El borrador solo se descarta cuando el alta tuvo éxito: si falla,
      // lo escrito sigue ahí.
      setBorrador(BORRADOR_VACIO)
      setErroresLocales({})
      onCreado(creado.nombre)
    }
  }

  function cerrar() {
    setErroresLocales({})
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={cerrar}
      titulo="Nuevo producto"
      color={slice.color}
      firma={<SliceTag slice={slice} tamano="pequeno" />}
    >
      <form onSubmit={enviar} noValidate className="space-y-4">
        <Campo etiqueta="Nombre" error={errores.nombre}>
          <input
            value={borrador.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)}
            placeholder="Teclado mecánico retroiluminado"
            className={entrada(errores.nombre)}
          />
        </Campo>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo etiqueta="SKU" error={errores.sku}>
            <input
              value={borrador.sku}
              onChange={(e) => actualizar('sku', e.target.value)}
              placeholder="PER-TEC-013"
              className={`${entrada(errores.sku)} font-mono text-xs`}
            />
          </Campo>

          <Campo etiqueta="Categoría" error={errores.categoria}>
            <input
              value={borrador.categoria}
              onChange={(e) => actualizar('categoria', e.target.value)}
              placeholder="Periféricos"
              className={entrada(errores.categoria)}
            />
          </Campo>

          <Campo etiqueta="Precio" error={errores.precio}>
            <input
              type="number"
              min="1"
              value={borrador.precio}
              onChange={(e) => actualizar('precio', e.target.value)}
              placeholder="189900"
              className={entrada(errores.precio)}
            />
          </Campo>

          <Campo etiqueta="Existencias" error={errores.stock}>
            <input
              type="number"
              min="0"
              value={borrador.stock}
              onChange={(e) => actualizar('stock', e.target.value)}
              placeholder="24"
              className={entrada(errores.stock)}
            />
          </Campo>
        </div>

        <Campo etiqueta="Descripción" error={errores.descripcion} opcional>
          <textarea
            rows={3}
            value={borrador.descripcion}
            onChange={(e) => actualizar('descripcion', e.target.value)}
            placeholder="Qué incluye y para quién es."
            className={`${entrada(errores.descripcion)} resize-none`}
          />
        </Campo>

        {errorGeneral && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorGeneral}</p>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variante="plano" color="#64748B" onClick={cerrar}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color={slice.color}
            disabled={enviando}
            icono={enviando ? undefined : <Check size={15} />}
          >
            {enviando ? 'Creando…' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function entrada(error?: string) {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-300
          focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
          }`
}

function Campo({
  etiqueta,
  error,
  opcional,
  children,
}: {
  etiqueta: string
  error?: string
  opcional?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {etiqueta}
        </span>
        {opcional && <span className="text-[10px] text-slate-400">opcional</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
