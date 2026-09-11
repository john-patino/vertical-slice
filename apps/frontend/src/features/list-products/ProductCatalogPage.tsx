import { useMemo, useState } from 'react'
import { PackageSearch, ServerCrash, RefreshCw, Eye } from 'lucide-react'
import { useProducts } from './useProducts'
import { ProductCard } from './ProductCard'
import { CatalogFilters } from './CatalogFilters'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { SliceTag } from '../../components/ui/SliceTag'
import { SLICES } from '../../lib/slices'
import { ProductDetailModal } from '../get-product-by-id/ProductDetailModal'
import { DeleteProductButton } from '../delete-product/DeleteProductButton'
import { CreateProductModal } from '../create-product/CreateProductModal'

// Esta página COMPONE componentes de otros slices, pero no comparte su acceso a
// datos: cada uno trae su propio hook y su propia petición. Componer en la capa
// de presentación no es acoplar casos de uso.

/** Normaliza para que "periferico" encuentre "Periféricos". */
const sinAcentos = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function ProductCatalogPage({
  altaAbierta = false,
  onCerrarAlta,
}: {
  altaAbierta?: boolean
  onCerrarAlta?: () => void
}) {
  const slice = SLICES.ListProducts
  const { productos, cargando, error, recargar } = useProducts()

  const [categoria, setCategoria] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [detalleId, setDetalleId] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b)),
    [productos],
  )

  // El filtrado ocurre en el cliente: con un catálogo pequeño la respuesta es
  // inmediata. El endpoint también acepta ?categoria= y ?buscar=, porque el
  // slice es dueño de su lógica de consulta.
  const visibles = useMemo(() => {
    const termino = sinAcentos(busqueda.trim())
    return productos.filter((p) => {
      const coincideCategoria = categoria === '' || p.categoria === categoria
      const coincideTermino =
        termino === '' ||
        sinAcentos(p.nombre).includes(termino) ||
        sinAcentos(p.sku).includes(termino)
      return coincideCategoria && coincideTermino
    })
  }, [productos, categoria, busqueda])

  function anunciar(mensaje: string) {
    setAviso(mensaje)
    void recargar()
    window.setTimeout(() => setAviso(null), 3500)
  }

  return (
    <>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Catálogo de productos
          </h1>
          <SliceTag slice={slice} />
        </div>
        <p className="mt-1.5 text-sm text-slate-500">
          Cada tarjeta abre su detalle con una petición propia al slice GetProductById.
        </p>
      </header>

      {aviso && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3
                     text-sm text-emerald-800 motion-safe:animate-[entrar_240ms_ease-out]"
        >
          {aviso}
        </div>
      )}

      {cargando && <Cargando />}

      {!cargando && error && (
        <EmptyState
          icono={<ServerCrash size={22} />}
          titulo="La API no respondió"
          descripcion={error}
          accion={
            <Button color={slice.color} icono={<RefreshCw size={15} />} onClick={() => void recargar()}>
              Reintentar
            </Button>
          }
        />
      )}

      {!cargando && !error && productos.length === 0 && (
        <EmptyState
          icono={<PackageSearch size={22} />}
          titulo="El catálogo está vacío"
          descripcion="La API respondió correctamente, pero no hay productos registrados todavía."
        />
      )}

      {!cargando && !error && productos.length > 0 && (
        <>
          <CatalogFilters
            categorias={categorias}
            categoria={categoria}
            busqueda={busqueda}
            onCategoria={setCategoria}
            onBusqueda={setBusqueda}
            resultados={visibles.length}
            total={productos.length}
          />

          {visibles.length === 0 ? (
            <EmptyState
              icono={<PackageSearch size={22} />}
              titulo="Ningún producto coincide"
              descripcion="Ajusta la categoría o el término de búsqueda para ver resultados."
              accion={
                <Button
                  variante="contorno"
                  color={slice.color}
                  onClick={() => {
                    setCategoria('')
                    setBusqueda('')
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibles.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onVerDetalle={() => setDetalleId(p.id)}
                  acciones={
                    <>
                      <Button
                        variante="plano"
                        color={SLICES.GetProductById.color}
                        onClick={() => setDetalleId(p.id)}
                        icono={<Eye size={14} />}
                        className="!px-2 !py-1 !text-xs"
                      >
                        Ver detalle
                      </Button>
                      <span className="ml-auto">
                        <DeleteProductButton
                          productoId={p.id}
                          nombre={p.nombre}
                          onEliminado={(n) => anunciar(`Se eliminó "${n}" del catálogo.`)}
                        />
                      </span>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      <ProductDetailModal
        productoId={detalleId}
        onCerrar={() => setDetalleId(null)}
        onRefrescarCatalogo={() => void recargar()}
      />

      <CreateProductModal
        abierto={altaAbierta}
        onCerrar={() => onCerrarAlta?.()}
        onCreado={(nombre) => {
          onCerrarAlta?.()
          anunciar(`Se creó "${nombre}".`)
        }}
      />
    </>
  )
}

function Cargando() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="h-4 w-20 rounded bg-slate-100" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
          <div className="mt-6 flex justify-between border-t border-slate-100 pt-4">
            <div className="h-5 w-24 rounded bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}
