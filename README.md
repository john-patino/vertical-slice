# Catálogo de productos · Vertical Slice Architecture

Demo ejecutable para el curso de Arquitectura de Software — Universidad Popular del Cesar, 2026.

Este repositorio existe para hacer tangible una diferencia que en diapositivas queda abstracta: **agregar una funcionalidad aquí significa crear una sola carpeta**, no tocar cinco proyectos. Se levanta con un comando y cada caso de uso cabe entero en una pantalla.

---

## Requisitos

Solo **Docker Desktop**. No hace falta instalar el SDK de .NET ni Node.js para ejecutar el demo.

## Ejecutar

```bash
cp .env.example .env
docker-compose up
```

Cuando los tres servicios terminen de arrancar:

| Servicio | URL | Qué es |
|---|---|---|
| Interfaz | http://localhost:5173 | Catálogo, alta y ajuste de inventario |
| API | http://localhost:5000 | Los cinco endpoints |
| Swagger | http://localhost:5000/swagger | Explorador de la API |
| PostgreSQL | `localhost:5432` | Base de datos |

El catálogo aparece con **10 productos de muestra**: la carga inicial corre sola si la tabla está vacía, para que una demostración en vivo nunca arranque en blanco.

Para empezar de cero:

```bash
docker-compose down -v   # descarta el volumen
docker-compose up        # migra y vuelve a sembrar los 10 productos
```

---

## Los cinco slices

| Caso de uso | Endpoint | Carpeta del backend | Carpeta del frontend |
|---|---|---|---|
| Listar catálogo | `GET /api/products` | `Features/ListProducts` | `features/list-products` |
| Ver detalle | `GET /api/products/{id}` | `Features/GetProductById` | `features/get-product-by-id` |
| Crear producto | `POST /api/products` | `Features/CreateProduct` | `features/create-product` |
| Ajustar existencias | `PATCH /api/products/{id}/stock` | `Features/UpdateProductStock` | `features/update-product-stock` |
| Eliminar producto | `DELETE /api/products/{id}` | `Features/DeleteProduct` | `features/delete-product` |

**Cinco slices, cinco carpetas a cada lado, sin excepciones.** La interfaz muestra arriba, de forma permanente, qué slice atendió la última acción: abre el catálogo, haz clic en un producto, crea otro, y observa cómo cambia esa barra. Esa correspondencia es el punto del demo.

### Probar la API desde la terminal

```bash
# Listar
curl http://localhost:5000/api/products

# Filtrar y buscar (el slice ListProducts es dueño de su consulta)
curl "http://localhost:5000/api/products?categoria=Periféricos"
curl "http://localhost:5000/api/products?buscar=mecanico"     # ignora acentos

# Detalle
curl http://localhost:5000/api/products/{id}

# Crear
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Hub USB-C","sku":"PER-HUB-020","categoria":"Periféricos","precio":145000,"stock":8,"descripcion":"Siete puertos."}'

# Ajustar existencias: el ajuste es un MOVIMIENTO con signo, no un stock absoluto
curl -X PATCH http://localhost:5000/api/products/{id}/stock \
  -H "Content-Type: application/json" -d '{"ajuste":-4}'

# Eliminar
curl -X DELETE http://localhost:5000/api/products/{id}
```

---

## Cómo leer el código

Abre `apps/backend/Features/CreateProduct/` y léela de arriba abajo:

```
CreateProduct/
├── CreateProductRequest.cs     # Lo que entra
├── CreateProductResponse.cs    # Lo que sale
├── CreateProductValidator.cs   # Las reglas de entrada
├── CreateProductHandler.cs     # Qué hace, incluido el acceso a datos
└── CreateProductEndpoint.cs    # Dónde vive en la API
```

Todo el caso de uso está ahí. No hay que saltar a `/Services`, ni a `/Repositories`, ni a `/DTOs`.

Compara ahora con `Features/DeleteProduct/`: tiene **tres** archivos, no cinco. No necesita DTO de respuesta (devuelve `204`) ni validador (su única entrada es un identificador). Esa asimetría es intencional: cada slice tiene exactamente los archivos que necesita. Una plantilla uniforme habría forzado los cinco en los cinco casos.

### Por qué no existe una capa de repositorios

Los handlers consultan `AppDbContext` directamente:

```csharp
var productos = await db.Products
    .Where(p => p.Categoria == categoria)
    .Select(p => new ListProductsResponse(...))
    .ToListAsync(ct);
```

La razón es simple: **`DbSet<T>` ya es un repositorio e `IQueryable` ya es una especificación.** Envolverlos en `IProductRepository` añade indirección sin añadir capacidad. El argumento de "poder cambiar de ORM" rara vez se cobra en la práctica, y mientras tanto cada consulta paga el costo de atravesar una capa que no decide nada.

La consecuencia honesta, que también hay que decir en clase: esto **acopla los handlers a EF Core**. En VSA se acepta porque el acoplamiento queda contenido dentro de un slice, y un slice se reescribe entero en una tarde. En una arquitectura en capas, ese mismo acoplamiento se esparce por todo el sistema.

### Cuándo SÍ conviene una capa compartida

Esto no es un dogma. Extraer código compartido se justifica cuando:

- La misma lógica de negocio la invocan **tres o más slices**.
- Hay integración con un **sistema externo** que requiere un contrato estable.
- La duplicación representa **conocimiento del negocio**, no coincidencia estructural.

Ninguno de los tres se cumple en este demo.

### La duplicación de DTOs es a propósito

`ListProductsResponse` y `GetProductByIdResponse` tienen hoy exactamente los mismos campos, y aun así **no** se extraen a un `ProductDto` compartido.

Un DTO compartido acopla dos casos de uso que no tienen relación entre sí. El día que el detalle necesite mostrar un historial de movimientos y el listado necesite seguir siendo ligero, ese tipo compartido se convierte en un campo de batalla: cada slice tirando del mismo tipo en direcciones opuestas.

La regla operativa: **duplicar formas de datos es barato; acoplar casos de uso es caro.** DRY aplica al conocimiento del negocio, no a la coincidencia estructural de dos DTOs en un momento dado.

Lo que sí se comparte es `Domain/Product.cs`, porque un solo esquema de base de datos exige una sola entidad. La línea es clara: **una entidad, muchos DTOs.**

> **Ejercicio de clase.** Agrega un campo solo a `GetProductByIdResponse` y comprueba que ningún otro slice se entera. Repite el ejercicio mentalmente sobre una arquitectura en capas con un `ProductDto` compartido y cuenta cuántos lugares habría que revisar.

### Por qué el modal de detalle hace su propia petición

Al abrir un producto, el frontend consulta `GET /api/products/{id}` aunque el catálogo ya tenga ese producto en memoria.

Reutilizar el objeto cargado sería la optimización obvia, y es justo por eso que se descarta: **compartir estado entre vistas es razonamiento en capas disfrazado.** En VSA cada slice es dueño de su acceso a datos, y esa regla no deja de aplicar por cruzar al cliente.

Hay además una consecuencia práctica: sin esa petición, el slice `GetProductById` del backend no tendría ningún consumidor. Sería código muerto que nadie ve ejecutarse.

El costo real es una petición de red evitable. Con 10 productos es irrelevante. **Cuándo cambiaría la decisión:** si el detalle se abriera cientos de veces por sesión, se añadiría caché *dentro* del slice `get-product-by-id`, sin tocar ningún otro.

### Comprueba tú mismo la eliminabilidad

```bash
rm -rf apps/backend/Features/GetProductById
cd apps/backend && dotnet build
```

Compila. Los otros cuatro endpoints siguen funcionando y su ruta desaparece sola, porque cada slice registra la suya mediante `IEndpoint` y nadie más la menciona. **Cero archivos editados.** Un `ProductsController` con cinco acciones habría roto esa propiedad: borrar un caso de uso obligaría a editar un archivo que pertenece a los otros cuatro.

Restaura con `git checkout apps/backend/Features/GetProductById`.

### MediatR no es la arquitectura

MediatR aporta el pipeline de validación, no la organización del código. Un slice podría invocar su handler directamente desde el endpoint y seguiría siendo Vertical Slice Architecture. No confundas la biblioteca con el patrón.

---

## Pruebas

```bash
cd apps/backend.tests && dotnet test
```

Diez pruebas de integración sobre los dos slices con reglas de negocio propias: `CreateProduct` (SKU único) y `UpdateProductStock` (stock no negativo). Los slices de consulta y borrado no aportan lección nueva al probarse.

Lo importante es **cómo** están escritas: entran por HTTP y verifican contra un PostgreSQL real levantado con Testcontainers. **No hay un solo doble de prueba**, y no por disciplina: es que no hay nada que simular. Sin `IProductRepository` de por medio, no existe la interfaz que solo se creó para poder mockearla. La prueba verifica el caso de uso, no el andamiaje.

Esa es una ventaja de VSA que solo se ve ejecutándola.

---

## Resolución de problemas

**El puerto 5432 ya está en uso.** Tienes un PostgreSQL local corriendo. Deténlo, o cambia el mapeo en `docker-compose.yml` a `"5433:5432"`.

**La API arranca y muere con "connection refused".** Docker Desktop no terminó de iniciar PostgreSQL. El `healthcheck` con `pg_isready` y `depends_on: condition: service_healthy` están para evitarlo; si aun así ocurre, `docker-compose restart backend`.

**El hot reload de Vite no detecta cambios en Windows.** Es un problema conocido de los volúmenes montados. `vite.config.ts` ya activa `usePolling`. Si sigue lento, ejecuta el frontend fuera de Docker:

```bash
docker-compose up db backend
cd apps/frontend && npm install
VITE_API_PROXY_TARGET=http://localhost:5000 npm run dev
```

**Quiero empezar con la base limpia.** `docker-compose down -v && docker-compose up`.

---

## Fuera de alcance, y por qué

Estas ausencias son decisiones, no trabajo pendiente:

- **Autenticación, autorización y gestión de usuarios.** Añadirían middleware transversal que distrae del punto central: cómo se organiza un caso de uso. Nota de paso: agregarlas *no alteraría la estructura de ningún slice*, lo cual es en sí mismo un argumento a favor de VSA.
- **Paginación del catálogo.** Con 10 productos fijos, paginar solo agregaría ruido al slice `ListProducts`.
- **Objetos de valor y modelado de dominio rico.** El precio es un `decimal` simple. Un `Money` con moneda enseñaría DDD táctico, no VSA, y mezclar ambos temas haría ambiguo qué beneficio proviene de qué patrón.
- **Caché, mensajería, eventos de dominio y CQRS con almacenes separados.** VSA no los exige. Incluirlos volvería imposible atribuir cada beneficio a su causa.
- **Multi-tenancy, carga de imágenes, CI/CD y despliegue.** El objetivo es la ejecución local en clase.

---

## Stack

PostgreSQL 16 · .NET 8 (EF Core, MediatR, FluentValidation) · React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons · Docker Compose
