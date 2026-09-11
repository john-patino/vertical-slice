## Context

El repositorio parte de cero. No hay código heredado, ni compatibilidad que preservar, ni usuarios en producción. Eso elimina las restricciones habituales y deja una sola fuerza dominante: **el código es material de clase**. Cada decisión técnica se juzga por lo que enseña, no por lo que escalaría.

Esto invierte varios criterios normales de ingeniería. Donde un proyecto real extraería código duplicado a una abstracción compartida, aquí se conserva la duplicación si hace visible la independencia de los slices. Donde un proyecto real añadiría una capa para aislar el ORM, aquí se omite porque esa capa es exactamente lo que Vertical Slice Architecture cuestiona.

La audiencia son estudiantes que ya conocen la arquitectura en capas (Controller → Service → Repository → DbContext). El demo debe producir un momento de contraste: abrir `Features/CreateProduct/` y comprobar que el caso de uso completo cabe en una carpeta y se lee de arriba abajo sin saltar entre proyectos.

Restricciones fijadas por el enunciado del curso: PostgreSQL 16, .NET 8, React 18 + Vite + TypeScript + Tailwind, orquestación con Docker Compose, y ausencia deliberada de autenticación.

## Goals / Non-Goals

**Goals:**

- Que agregar un caso de uso signifique crear **una carpeta** y nada más — sin registrar interfaces, sin tocar una capa de servicios, sin modificar un repositorio compartido.
- Que cada slice sea **eliminable**: borrar su carpeta debe dejar el proyecto compilando.
- Que la correspondencia entre acción de usuario, endpoint REST y carpeta de slice sea **uno a uno y visible** en el árbol de archivos, tanto en backend como en frontend.
- Que el entorno completo se levante con `docker-compose up` sin instalar SDKs en la máquina anfitriona.
- Que el catálogo nunca aparezca vacío en una demostración en vivo.

**Non-Goals:**

- No es una plantilla lista para producción. Falta observabilidad, resiliencia, rate limiting y gestión de secretos real.
- No pretende demostrar CQRS con almacenes separados de lectura y escritura. MediatR se usa aquí como despachador de casos de uso, no como bus de eventos.
- No busca cobertura de pruebas alta. Las pruebas incluidas existen para mostrar que un slice se prueba de extremo a extremo sin dobles de prueba.
- No modela un dominio rico. `Product` es deliberadamente anémico; introducir agregados y eventos de dominio mezclaría DDD táctico con VSA y haría ambiguo qué beneficio proviene de qué patrón.

## Decisions

### Decisión 1: El slice es la unidad de organización, no la capa técnica

Todo lo que cambia junto vive junto. Cada caso de uso es una carpeta bajo `Features/` que contiene su petición, su respuesta, su validación, su lógica y su acceso a datos.

**Árbol completo del backend:**

```
apps/backend/
├── Dockerfile
├── VerticalSlice.Api.csproj
├── Program.cs                          # Registro de servicios + mapeo de endpoints
├── Domain/
│   └── Product.cs                      # Entidad única, compartida por todos los slices
├── Persistence/
│   ├── AppDbContext.cs
│   ├── Migrations/
│   └── DatabaseSeeder.cs               # Carga inicial de 10 productos
├── Common/
│   ├── ValidationBehavior.cs           # Pipeline de MediatR: valida antes del handler
│   └── ExceptionHandler.cs             # Excepciones → ProblemDetails
└── Features/
    ├── CreateProduct/
    │   ├── CreateProductRequest.cs
    │   ├── CreateProductResponse.cs
    │   ├── CreateProductValidator.cs
    │   ├── CreateProductHandler.cs
    │   └── CreateProductEndpoint.cs
    ├── GetProductById/
    │   ├── GetProductByIdRequest.cs
    │   ├── GetProductByIdResponse.cs
    │   ├── GetProductByIdHandler.cs
    │   └── GetProductByIdEndpoint.cs
    ├── ListProducts/
    │   ├── ListProductsRequest.cs       # Filtros: categoria, buscar
    │   ├── ListProductsResponse.cs
    │   ├── ListProductsHandler.cs
    │   └── ListProductsEndpoint.cs
    ├── UpdateProductStock/
    │   ├── UpdateProductStockRequest.cs
    │   ├── UpdateProductStockResponse.cs
    │   ├── UpdateProductStockValidator.cs
    │   ├── UpdateProductStockHandler.cs
    │   └── UpdateProductStockEndpoint.cs
    └── DeleteProduct/
        ├── DeleteProductRequest.cs
        ├── DeleteProductHandler.cs
        └── DeleteProductEndpoint.cs
```

Obsérvese que los slices **no son simétricos**: `DeleteProduct` no tiene DTO de respuesta (devuelve `204`), y `GetProductById` y `ListProducts` no tienen validador (sus entradas se validan por tipo en la ruta). Esa asimetría es el punto: cada slice tiene exactamente los archivos que necesita, ni uno más. Una plantilla en capas habría forzado los cinco archivos en los cinco casos.

**Alternativa descartada:** organizar por capas (`Controllers/`, `Services/`, `Repositories/`, `DTOs/`). Es lo que el demo existe para contrastar. Se documentará en el README como la arquitectura de referencia contra la cual comparar.

### Decisión 2: Sin capa de repositorios — los handlers usan `AppDbContext` directamente

Cada handler recibe `AppDbContext` por inyección y consulta directamente:

```csharp
var productos = await db.Products
    .Where(p => categoria == null || p.Categoria == categoria)
    .Select(p => new ListProductsResponse(p.Id, p.Nombre, p.Sku, ...))
    .ToListAsync(ct);
```

La justificación que debe aparecer en el README: `DbSet<T>` **ya es** un repositorio, e `IQueryable` **ya es** una especificación. Envolverlos en `IProductRepository` añade indirección sin añadir capacidad, y el argumento de "poder cambiar de ORM" rara vez se cobra en la práctica — mientras tanto, cada consulta paga el costo de atravesar una capa que no decide nada.

Consecuencia honesta que también debe decirse en clase: esto acopla los handlers a EF Core. En VSA se acepta porque el acoplamiento queda **contenido dentro de un slice**, y un slice se reescribe entero en una tarde. En capas, el mismo acoplamiento se esparce por todo el sistema.

**Alternativa descartada:** repositorio genérico `IRepository<T>`. Precisamente el antipatrón que el demo debe hacer visible.

### Decisión 3: MediatR con endpoints mínimos, no controladores

`Program.cs` mapea endpoints mínimos que solo despachan a MediatR. El `IEndpoint` de cada slice registra su propia ruta mediante una interfaz de marcado descubierta por reflexión al arrancar.

Esto sostiene la regla de eliminabilidad: borrar `Features/DeleteProduct/` retira su endpoint automáticamente, sin dejar una referencia colgante en un controlador compartido. Un `ProductsController` con cinco acciones habría roto esa propiedad — borrar un caso de uso obligaría a editar un archivo que pertenece a los otros cuatro.

**Alternativa descartada:** un controlador por slice. Funciona, pero arrastra el vocabulario MVC que el demo intenta desplazar.

### Decisión 4: Validación en el pipeline, reglas dentro del slice

`ValidationBehavior` es el único comportamiento transversal del backend: intercepta toda petición, ejecuta el `IValidator<T>` correspondiente si existe, y lanza si falla. Vive en `Common/` porque es infraestructura, no lógica de negocio.

Las **reglas** viven en el slice. La regla de stock no negativo está en `UpdateProductStock`, no en `Domain/Product.cs`, porque es la única operación que puede violarla. Subirla al dominio la haría visible para cuatro slices a los que no les concierne.

### Decisión 5: DTOs duplicados entre slices — aceptado a propósito

`ListProductsResponse` y `GetProductByIdResponse` tienen hoy los mismos campos. **No se extraen a un `ProductDto` compartido.**

Esta es la duplicación más visible del proyecto y merece discusión explícita en clase. La justificación: un DTO compartido crea acoplamiento entre casos de uso que no tienen relación entre sí. El día que el detalle necesite mostrar un historial de movimientos y el listado necesite seguir siendo ligero, el DTO compartido se convierte en un campo de batalla — cada slice tirando del mismo tipo en direcciones opuestas.

La regla operativa: **duplicar formas de datos es barato; acoplar casos de uso es caro.** DRY aplica al conocimiento del negocio, no a la coincidencia estructural de dos DTOs en un momento dado.

Lo que sí se comparte: `Domain/Product.cs`, porque es el modelo persistido y un solo esquema de base de datos exige una sola entidad. La línea divisoria del demo es clara — **una entidad, muchos DTOs**.

### Decisión 6: El frontend refleja la estructura del backend

```
apps/frontend/
├── Dockerfile
├── vite.config.ts                      # Proxy /api → backend:5000
├── tailwind.config.js
└── src/
    ├── main.tsx
    ├── App.tsx                         # Rutas
    ├── lib/
    │   ├── api.ts                      # fetch + manejo de ProblemDetails
    │   └── types.ts
    ├── components/
    │   ├── layout/
    │   │   ├── AppLayout.tsx
    │   │   └── Sidebar.tsx             # Permanente ≥1024px, desplegable debajo
    │   └── ui/
    │       ├── Modal.tsx
    │       ├── Button.tsx
    │       └── EmptyState.tsx
    └── features/
        ├── list-products/
        │   ├── ProductCatalogPage.tsx
        │   ├── ProductCard.tsx
        │   ├── CatalogFilters.tsx
        │   └── useProducts.ts
        ├── get-product-by-id/
        │   ├── ProductDetailModal.tsx
        │   └── useProduct.ts              # Petición propia a GET /api/products/{id}
        ├── create-product/
        │   ├── CreateProductModal.tsx
        │   ├── useCreateProduct.ts
        │   └── validation.ts
        ├── update-product-stock/
        │   ├── StockAdjustmentPage.tsx
        │   └── useUpdateStock.ts
        └── delete-product/
            ├── DeleteProductButton.tsx
            └── useDeleteProduct.ts
```

Poner `apps/backend/Features/` y `apps/frontend/src/features/` lado a lado en la pantalla hace que la correspondencia se explique sola: **cinco slices, cinco carpetas, sin excepciones que justificar**.

**Alternativa descartada:** organizar el frontend por tipo (`components/`, `hooks/`, `pages/`). Habría roto la correspondencia visual, que es el principal valor pedagógico del frontend en este demo.

### Decisión 6b: Cada slice del frontend hace su propia petición

`ProductDetailModal` consulta `GET /api/products/{id}` al abrirse, en lugar de reutilizar el producto que el catálogo ya tiene cargado en memoria.

Reutilizar el estado del catálogo sería la optimización obvia, y es justamente por eso que se descarta: **es razonamiento en capas disfrazado** — dos vistas compartiendo un almacén de estado común. En VSA cada slice es dueño de su propio acceso a datos, y esa regla no deja de aplicar por cruzar al cliente.

Hay además una consecuencia práctica que pesa más que la teoría: sin esta decisión, el slice `GetProductById` del backend **no tendría ningún consumidor**. Sería código muerto que el estudiante recorre sin verlo ejecutarse nunca. La petición adicional es el precio de que los cinco casos de uso sean demostrables desde la interfaz.

El costo real es una petición de red que "podría haberse evitado". Con 10 productos es irrelevante. El README debe nombrar el costo explícitamente y decir cuándo cambiaría la decisión: si el detalle se abriera cientos de veces por sesión, se añadiría caché **dentro del slice** `get-product-by-id`, sin tocar ningún otro.

**Alternativa descartada:** pasar el producto ya cargado como prop desde `ProductCard`. Más rápido, pero acopla el slice de detalle al de listado y deja un endpoint del backend sin ejercitar.

### Decisión 7: Filtrado en el cliente, aunque el backend también lo soporte

El endpoint `ListProducts` acepta `categoria` y `buscar`, pero la interfaz filtra en el cliente sobre la colección ya cargada.

No es una contradicción: el endpoint demuestra que el slice de listado **posee** su propia lógica de consulta, y el cliente prioriza la respuesta inmediata con 10 productos. El README debe decir cuándo cambiaría la decisión — a partir de unos cientos de productos, el filtro se mueve al servidor y se añade paginación al slice `ListProducts`, sin tocar ningún otro.

### Decisión 8: Pruebas de integración por slice, sin dobles de prueba

Se incluye un proyecto `apps/backend.tests` con una prueba de integración de extremo a extremo para `CreateProduct` y otra para `UpdateProductStock`, usando `WebApplicationFactory` contra PostgreSQL real levantado con Testcontainers.

Estas dos se eligen porque son las únicas con reglas de negocio propias — SKU único y stock no negativo. Los slices de consulta y borrado no aportan lección nueva al probarse.

La razón de fondo es que **esta es la forma de prueba que VSA habilita**. No hay `IProductRepository` que simular, así que no hay un mock que dependa de una abstracción inventada solo para hacerla simulable. La prueba entra por HTTP y verifica contra la base de datos: prueba el caso de uso, no el andamiaje. Es un argumento a favor de la arquitectura que solo se ve ejecutándolo.

Una prueba por slice vive junto a su slice: `apps/backend.tests/Features/CreateProduct/CreateProductTests.cs`. La misma regla de organización que el código de producción.

**Alternativa descartada:** pruebas unitarias con handlers mockeados. Exigirían introducir interfaces cuyo único propósito sería la simulación — la clase de abstracción que el demo existe para cuestionar.

### Decisión 9: El precio es `decimal`, no un objeto de valor

`Product.Precio` se modela como `decimal(10,2)` sin moneda asociada.

Un objeto de valor `Money` con moneda y aritmética propia sería mejor modelado de dominio, pero enseña **DDD táctico, no VSA**. Mezclar los dos temas en un demo de una sesión haría ambiguo qué beneficio proviene de qué patrón, que es precisamente el fallo pedagógico que este proyecto intenta evitar.

### Decisión 10: Migraciones y seed al arrancar la API

La API ejecuta `Database.MigrateAsync()` y luego `DatabaseSeeder.SeedAsync()` antes de atender peticiones. El seed consulta `AnyAsync()` y no hace nada si hay datos.

PostgreSQL declara un `healthcheck` con `pg_isready` y la API declara `depends_on: condition: service_healthy`. Sin eso, la API gana la carrera de arranque y falla por conexión rechazada — el primer tropiezo clásico al levantar el demo en clase.

Se usan migraciones y no `EnsureCreated()` porque el estudiante debe ver el flujo de trabajo real de EF Core, y porque `EnsureCreated()` no admite evolución del esquema.

## Risks / Trade-offs

**[Los estudiantes generalizan "VSA = sin abstracciones"]** → El README y el material de clase deben enmarcar la ausencia de repositorios como una decisión con contexto, no como un dogma. Incluir una sección "cuándo SÍ conviene una capa compartida" con criterios concretos: lógica invocada por tres o más slices, o integración con un sistema externo que requiera un contrato estable.

**[La duplicación de DTOs se lee como descuido]** → La Decisión 5 está escrita para citarse en clase. Además, el README debe contener el ejercicio de divergencia: pedir que agreguen un campo solo al detalle y comprobar que ningún otro slice se entera.

**[MediatR añade ceremonia que oscurece el punto]** → Riesgo real: un estudiante podría concluir que VSA exige MediatR, cuando no es así. El README debe mostrar cómo se vería un slice con el handler invocado directamente desde el endpoint, y explicar que MediatR aporta el pipeline de validación, no la arquitectura.

**[El registro de endpoints por reflexión parece magia]** → Mantener `Program.cs` corto y comentado, con el escaneo en un único método legible de menos de diez líneas.

**[Docker Compose falla en máquinas de estudiantes]** → Puertos ocupados y memoria insuficiente son los fallos habituales. El README necesita una sección de resolución de problemas con los tres casos frecuentes: puerto 5432 ya en uso por un PostgreSQL local, Docker Desktop sin iniciar, y hot reload de Vite sin funcionar por montaje de volumen en Windows.

**[El hot reload de Vite es lento con volúmenes montados en Windows]** → Configurar `usePolling` en `vite.config.ts` y documentar la alternativa de ejecutar el frontend fuera de Docker con `npm run dev` apuntando a la API contenerizada.

**[La petición extra del modal de detalle se lee como ineficiencia]** → Un estudiante atento notará que el catálogo ya tenía el producto en memoria. Es una buena objeción y merece respuesta preparada, no evasiva: la Decisión 6b está escrita para citarse tal cual, incluyendo cuándo cambiaría el criterio.

**[Sin autenticación, el demo parece incompleto]** → Declararlo como decisión en el README, no como pendiente. Anotar dónde encajaría si se agregara: un middleware transversal más, sin alterar la estructura de ningún slice — lo cual es en sí mismo un argumento a favor de VSA.

## Migration Plan

No aplica: el repositorio parte de cero y no hay datos ni consumidores previos. La estrategia de reversión durante el desarrollo es `docker-compose down -v`, que descarta el volumen y devuelve el entorno a un estado limpio con el seed intacto.

## Open Questions

- **¿Conviene incluir una rama `arquitectura-en-capas` con la misma funcionalidad organizada en capas, para comparar lado a lado?** Sería el recurso didáctico más potente del proyecto: el contraste dejaría de ser narrado y pasaría a ser verificable con un `git diff`. Pero duplica el esfuerzo de construcción y mantenimiento, y no altera la fidelidad a VSA del código principal — es un eje independiente. Queda pendiente del tiempo disponible antes del curso, y no bloquea la implementación de este cambio.

### Preguntas resueltas

Se cerraron durante la revisión del diseño y quedan documentadas aquí para que la discusión no se reabra sin motivo nuevo:

- **¿Se incluyen pruebas automatizadas y de qué tipo?** → Sí: dos pruebas de integración sin dobles de prueba, para `CreateProduct` y `UpdateProductStock`. Ver Decisión 8.
- **¿El precio es `decimal` o un objeto de valor `Money`?** → `decimal(10,2)`. Ver Decisión 9.
- **¿El frontend necesita una carpeta para `get-product-by-id`?** → Sí, con petición propia al endpoint de detalle. Sin ella, ese slice del backend quedaría sin consumidor. Ver Decisión 6b.
