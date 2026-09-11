## 1. Cimientos del monorepo y entorno

- [x] 1.1 Crear la estructura `apps/backend` y `apps/frontend`, con `.gitignore` que excluya `bin/`, `obj/`, `node_modules/` y `.env`
- [x] 1.2 Crear el proyecto .NET 8 Web API en `apps/backend` con los paquetes MediatR, FluentValidation.AspNetCore y Npgsql.EntityFrameworkCore.PostgreSQL; verificar que `dotnet build` compila
- [x] 1.3 Crear la app Vite + React 18 + TypeScript en `apps/frontend` con Tailwind CSS, Lucide Icons y React Router; verificar que `npm run build` compila
- [x] 1.4 Escribir `docker-compose.yml` con PostgreSQL 16 (5432), API (5000) y Vite (5173), incluyendo `healthcheck` con `pg_isready` y `depends_on: condition: service_healthy` en la API
- [x] 1.5 Escribir `.env.example` documentando la cadena de conexión y la URL base de la API, sin credenciales reales
- [x] 1.6 Escribir los `Dockerfile` de backend y frontend; verificar que `docker-compose up` levanta los tres servicios y que PostgreSQL acepta conexiones antes de que arranque la API

## 2. Modelo persistido y carga inicial

- [x] 2.1 Definir `Domain/Product.cs` con Id, Nombre, Sku, Categoria, Precio (`decimal(10,2)`), Stock y Descripcion
- [x] 2.2 Definir `Persistence/AppDbContext.cs` con la configuración de `Product` e índice único sobre `Sku`
- [x] 2.3 Generar la migración inicial de EF Core y aplicarla automáticamente al arrancar con `Database.MigrateAsync()`; verificar que arrancar contra una base ya migrada no produce cambios
- [x] 2.4 Implementar `Persistence/DatabaseSeeder.cs` con 10 productos que abarquen al menos tres categorías y al menos uno con Stock menor que 5; el seed solo inserta si `AnyAsync()` es falso
- [x] 2.5 Verificar la idempotencia del seed: reiniciar la API tres veces contra la misma base y confirmar que siguen existiendo exactamente 10 productos sin duplicados

## 3. Infraestructura transversal mínima

- [ ] 3.1 Implementar `Common/ValidationBehavior.cs` como pipeline de MediatR que ejecuta el `IValidator<T>` del slice cuando existe
- [ ] 3.2 Implementar `Common/ExceptionHandler.cs` que traduce excepciones a `ProblemDetails` con los códigos 400, 404, 409 y 422
- [ ] 3.3 Implementar el descubrimiento de endpoints por reflexión en `Program.cs` mediante una interfaz de marcado `IEndpoint`, en un método de menos de diez líneas; verificar que borrar una carpeta de slice retira su ruta sin editar otro archivo

## 4. Slice ListProducts

- [ ] 4.1 Crear `Features/ListProducts/` con Request (filtros `categoria` y `buscar`), Response, Handler que consulta `AppDbContext` directamente y Endpoint `GET /api/products`
- [ ] 4.2 Verificar que un catálogo sembrado devuelve `200 OK` con 10 elementos y que un catálogo vacío devuelve `200 OK` con arreglo vacío, nunca `404`
- [ ] 4.3 Verificar que `?categoria=` filtra ignorando mayúsculas y que `?buscar=` coincide sobre Nombre y SKU sin distinguir acentos

## 5. Slice GetProductById

- [ ] 5.1 Crear `Features/GetProductById/` con Request, Response propio (sin reutilizar el de ListProducts), Handler y Endpoint `GET /api/products/{id}`
- [ ] 5.2 Verificar que un identificador existente devuelve `200 OK`, uno inexistente `404 Not Found` con `ProblemDetails`, y uno con formato no-GUID `400 Bad Request` sin consultar la base
- [ ] 5.3 Verificar la eliminabilidad del slice: borrar la carpeta completa y confirmar que el proyecto compila y los demás endpoints responden

## 6. Slice CreateProduct

- [ ] 6.1 Crear `Features/CreateProduct/` con Request, Response, Validator, Handler y Endpoint `POST /api/products`
- [ ] 6.2 Implementar las reglas del validador: Nombre 3–120, SKU 3–40 alfanumérico con guiones, Categoría hasta 60, Precio mayor que cero, Stock mayor o igual que cero, Descripción hasta 500
- [ ] 6.3 Verificar que un alta válida responde `201 Created` con cabecera `Location` y que un SKU duplicado responde `409 Conflict` sin crear registro
- [ ] 6.4 Verificar que Precio no positivo y Stock negativo devuelven `400 Bad Request` sin consultar la base, y que varios campos inválidos se enumeran en una sola respuesta

## 7. Slice UpdateProductStock

- [ ] 7.1 Crear `Features/UpdateProductStock/` con Request (campo `ajuste` entero con signo), Response (stock anterior y nuevo), Validator, Handler y Endpoint `PATCH /api/products/{id}/stock`
- [ ] 7.2 Implementar la regla de stock no negativo dentro del slice, no en `Domain/Product.cs`
- [ ] 7.3 Verificar entrada (`+5` sobre 12 da 17), salida (`-4` sobre 12 da 8) y salida exacta hasta cero (`-12` sobre 12 da 0 con `200 OK`)
- [ ] 7.4 Verificar que una salida mayor que la existencia devuelve `422` conservando el stock previo, y que `ajuste` igual a cero devuelve `400`

## 8. Slice DeleteProduct

- [ ] 8.1 Crear `Features/DeleteProduct/` con Request, Handler y Endpoint `DELETE /api/products/{id}`, sin DTO de respuesta
- [ ] 8.2 Verificar que la eliminación responde `204 No Content`, que un identificador inexistente responde `404`, y que consultar el producto eliminado devuelve `404`

## 9. Layout y cimientos del frontend

- [ ] 9.1 Implementar `lib/api.ts` con el cliente `fetch` y el manejo de `ProblemDetails` para 400, 404, 409 y 422; configurar el proxy `/api` en `vite.config.ts`
- [ ] 9.2 Implementar `components/layout/Sidebar.tsx` con enlaces a Catálogo, Nuevo Producto y Ajuste de Inventario, y resaltado del enlace activo
- [ ] 9.3 Implementar `AppLayout.tsx` y las rutas; verificar sidebar permanente a 1280 px y colapsado con botón de alternancia a 375 px
- [ ] 9.4 Verificar que seleccionar un enlace en móvil navega y cierra el menú automáticamente
- [ ] 9.5 Implementar los componentes compartidos `Modal.tsx`, `Button.tsx` y `EmptyState.tsx`

## 10. Frontend del slice list-products

- [ ] 10.1 Implementar `features/list-products/` con `useProducts.ts`, `ProductCatalogPage.tsx` y `ProductCard.tsx` mostrando Nombre, SKU, Categoría, Precio y Stock
- [ ] 10.2 Implementar los estados de carga y de error con acción de reintento; verificar ambos deteniendo la API
- [ ] 10.3 Implementar el distintivo visual de stock bajo para productos con Stock menor que 5
- [ ] 10.4 Implementar `CatalogFilters.tsx` con selector de categoría y búsqueda en tiempo real, filtrando en el cliente sin botón de confirmación
- [ ] 10.5 Verificar filtro y búsqueda por separado, combinados, y el estado vacío con acción para limpiar filtros

## 11. Frontend del slice create-product

- [ ] 11.1 Implementar `features/create-product/` con `CreateProductModal.tsx`, `useCreateProduct.ts` y `validation.ts`
- [ ] 11.2 Verificar que un alta válida cierra el modal, muestra confirmación y el producto aparece en el catálogo sin recargar la página
- [ ] 11.3 Verificar que un `400` muestra cada error junto a su campo conservando lo escrito, y que un `409` señala el conflicto junto al campo SKU
- [ ] 11.4 Verificar que el botón de confirmación queda deshabilitado durante el envío

## 12. Frontend del slice get-product-by-id

- [ ] 12.1 Implementar `features/get-product-by-id/` con `useProduct.ts`, que emite su propia petición a `GET /api/products/{id}` sin reutilizar el objeto cargado por el catálogo
- [ ] 12.2 Implementar `ProductDetailModal.tsx` mostrando Nombre, SKU, Categoría, Precio, Stock y Descripción completa, abierto desde una tarjeta del catálogo
- [ ] 12.3 Verificar en el panel de red del navegador que abrir el detalle dispara una petición a `/api/products/{id}`, confirmando que el slice es dueño de su acceso a datos
- [ ] 12.4 Implementar el estado de carga del modal y el manejo de `404` con acción para refrescar el catálogo
- [ ] 12.5 Verificar que cerrar el modal con el botón y con la tecla Escape conserva los filtros activos del catálogo

## 13. Frontend de los slices update-product-stock y delete-product

- [ ] 13.1 Implementar `features/update-product-stock/` con `StockAdjustmentPage.tsx` y `useUpdateStock.ts` para seleccionar producto y aplicar ajuste con signo
- [ ] 13.2 Verificar que un ajuste válido muestra el stock resultante y que un `422` muestra el motivo y el stock disponible sin alterar el valor mostrado
- [ ] 13.3 Implementar `features/delete-product/` con `DeleteProductButton.tsx`, `useDeleteProduct.ts` y confirmación previa
- [ ] 13.4 Verificar la correspondencia 5↔5 entre `apps/backend/Features/` y `apps/frontend/src/features/` comparando ambos árboles, sin carpetas huérfanas en ninguno de los dos lados
- [ ] 13.5 Verificar con el panel de red que un recorrido completo por la interfaz invoca los cinco endpoints, sin que ninguno quede sin ejercitar

## 14. Pruebas de integración por slice

- [ ] 14.1 Crear el proyecto `apps/backend.tests` con xUnit, `Microsoft.AspNetCore.Mvc.Testing` y `Testcontainers.PostgreSql`
- [ ] 14.2 Implementar el `WebApplicationFactory` de pruebas que levanta PostgreSQL con Testcontainers y aplica migraciones contra una base efímera
- [ ] 14.3 Escribir `Features/CreateProduct/CreateProductTests.cs` cubriendo alta válida con `201`, SKU duplicado con `409` y precio no positivo con `400`, entrando por HTTP y verificando contra la base
- [ ] 14.4 Escribir `Features/UpdateProductStock/UpdateProductStockTests.cs` cubriendo entrada, salida hasta cero y salida excesiva con `422` conservando el stock previo
- [ ] 14.5 Verificar que `dotnet test` pasa sin usar ningún doble de prueba ni interfaz creada exclusivamente para simular, confirmando que las pruebas ejercitan el caso de uso y no el andamiaje

## 15. Documentación y verificación de extremo a extremo

- [ ] 15.1 Escribir el `README.md` con requisitos previos, el flujo `docker-compose up`, la tabla de los cinco endpoints y ejemplos de `curl` para cada uno
- [ ] 15.2 Añadir al README el recorrido de lectura slice por slice y la explicación de por qué no existe una capa de repositorios
- [ ] 15.3 Añadir al README la justificación de la duplicación de DTOs entre `ListProducts` y `GetProductById`, con el ejercicio de divergencia propuesto para clase
- [ ] 15.4 Añadir al README la justificación de la petición propia del modal de detalle y el criterio bajo el cual cambiaría esa decisión
- [ ] 15.5 Añadir al README la sección de fuera de alcance con su justificación, incluyendo por qué se omite la autenticación
- [ ] 15.6 Añadir al README la sección de resolución de problemas: puerto 5432 ocupado, Docker Desktop sin iniciar y hot reload de Vite en Windows
- [ ] 15.7 Verificación final desde cero: `docker-compose down -v`, luego `docker-compose up`, y confirmar que `http://localhost:5173` muestra 10 productos y que los cinco casos de uso funcionan desde la interfaz
