import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProductCatalogPage } from './features/list-products/ProductCatalogPage'
import { StockAdjustmentPage } from './features/update-product-stock/StockAdjustmentPage'

export default function App() {
  const navegar = useNavigate()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ProductCatalogPage />} />
        <Route
          path="nuevo"
          element={<ProductCatalogPage altaAbierta onCerrarAlta={() => navegar('/')} />}
        />
        <Route path="inventario" element={<StockAdjustmentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
