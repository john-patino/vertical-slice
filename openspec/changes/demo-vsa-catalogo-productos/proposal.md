## Why

El curso de Arquitectura de Software necesita un artefacto ejecutable que haga tangible la diferencia entre **Vertical Slice Architecture** y la arquitectura en capas tradicional. Explicar VSA en diapositivas deja la idea abstracta: los estudiantes entienden el diagrama pero no sienten el beneficio hasta que abren un repositorio real y comprueban que agregar una funcionalidad significa crear **una sola carpeta**, no tocar cinco proyectos.

Este demo existe para que esa comparación sea inmediata y verificable en clase: se levanta con un comando, se lee slice por slice, y cada caso de uso cabe entero en una pantalla.

## What Changes

- **Monorepo nuevo** con `/apps/backend` (.NET 8 Web API) y `/apps/frontend` (React 18 + Vite + TypeScript).
- **Cinco slices verticales autosuficientes** en `Features/`: `CreateProduct`, `GetProductById`, `ListProducts`, `UpdateProductStock`, `DeleteProduct`. Cada carpeta contiene su Request, Response, Validator, Handler y consulta a datos.
- **Acceso a datos sin repositorio genérico**: los handlers consultan `AppDbContext` (EF Core) directamente. La ausencia de `/Repositories` es una decisión pedagógica explícita, no un olvido — es precisamente el contraste que el demo debe mostrar.
- **PostgreSQL 16 en Docker** con migraciones EF Core y seed automático de 10 productos (Nombre, SKU, Categoría, Precio, Stock, Descripción) que corre solo si la tabla está vacía, para que el catálogo nunca aparezca en blanco durante una demostración.
- **Frontend alineado 1:1 con los slices**: sidebar responsivo (Catálogo, Nuevo Producto, Ajuste de Stock), catálogo en cuadrícula con filtro por categoría y búsqueda en tiempo real, modal de detalle y formularios modales. La estructura de carpetas del frontend refleja la del backend para que la correspondencia se vea sin explicarla, y **cada slice del cliente hace su propia petición** en lugar de compartir estado entre vistas.
- **Dos pruebas de integración sin dobles de prueba** (`CreateProduct` y `UpdateProductStock`), que entran por HTTP contra PostgreSQL real. Son la evidencia ejecutable del beneficio: sin repositorio que simular, la prueba verifica el caso de uso y no el andamiaje.
- **Orquestación con `docker-compose.yml`** que vincula PostgreSQL (5432), API (5000) y Vite dev server (5173).
- **README completo** con el flujo `docker-compose up` y un recorrido guiado de lectura del código, slice por slice.

Sin cambios de ruptura: el repositorio parte de cero.

## Capabilities

### New Capabilities

- `product-catalog`: consulta de productos — listado con filtros y obtención por identificador. Cubre los slices `ListProducts` y `GetProductById`.
- `product-authoring`: alta y baja de productos del catálogo, con validación de SKU único. Cubre los slices `CreateProduct` y `DeleteProduct`.
- `inventory-adjustment`: ajuste de existencias de un producto con reglas de stock no negativo. Cubre el slice `UpdateProductStock`.
- `catalog-web-ui`: interfaz React con layout de sidebar responsivo, catálogo filtrable, modal de detalle y formularios modales, con una carpeta por cada slice del backend y ningún endpoint sin consumidor.
- `local-dev-environment`: entorno reproducible con Docker Compose, migraciones y carga inicial automática de 10 productos de muestra.

### Modified Capabilities

Ninguna. No existen specs previas en `openspec/specs/`.

## Impact

**Código nuevo** (todo el repositorio):

- `apps/backend/` — proyecto .NET 8 Web API: `Program.cs`, `Features/<Slice>/`, `Persistence/AppDbContext.cs`, `Persistence/Seed/`, `Domain/Product.cs`.
- `apps/frontend/` — app Vite: `src/features/<slice>/` (una carpeta por cada uno de los cinco slices), `src/components/layout/`, `src/lib/api.ts`.
- `apps/backend.tests/` — proyecto xUnit con pruebas de integración organizadas por slice.
- Raíz — `docker-compose.yml`, `.env.example`, `README.md`, `.gitignore`.

**Dependencias introducidas**: MediatR y FluentValidation (backend); xUnit, `Microsoft.AspNetCore.Mvc.Testing` y `Testcontainers.PostgreSql` (pruebas); Tailwind CSS, Lucide Icons y React Router (frontend); imagen `postgres:16-alpine`.

**Superficie de API REST**: `POST /api/products`, `GET /api/products`, `GET /api/products/{id}`, `PATCH /api/products/{id}/stock`, `DELETE /api/products/{id}`.

**Requisitos del entorno**: Docker Desktop. No se requiere instalar .NET SDK ni Node localmente para ejecutar el demo.

## Fuera de alcance

Se omiten deliberadamente, y el README debe decir por qué, para que la ausencia se lea como decisión y no como deuda:

- **Autenticación, autorización y gestión de usuarios** — añadirían middleware transversal que distrae del punto central: cómo se organiza un caso de uso.
- **Multi-tenancy** y aislamiento por organización.
- **Paginación del catálogo** — con 10 productos fijos, paginar solo agregaría ruido al slice `ListProducts`.
- **Carga de imágenes de producto** y almacenamiento de archivos.
- **Caché, mensajería, eventos de dominio y CQRS con almacenes separados de lectura/escritura** — VSA no los exige, y mezclarlos haría ambiguo qué beneficio proviene de qué patrón.
- **Pipeline de CI/CD y despliegue a producción** — el objetivo es la ejecución local en clase.
- **Cobertura de pruebas exhaustiva** — se incluyen únicamente las dos pruebas de integración de `CreateProduct` y `UpdateProductStock`, que son los slices con reglas de negocio propias. Los slices de consulta y borrado no aportan lección nueva al probarse.
- **Objetos de valor y modelado de dominio rico** — el precio es un `decimal` simple. Un `Money` con moneda enseñaría DDD táctico, no VSA, y mezclar ambos temas haría ambiguo qué beneficio proviene de qué patrón.
