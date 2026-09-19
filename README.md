# Catálogo de Productos · Vertical Slice Architecture (VSA)
## Guía Teórico-Práctica y Manual de Estudio de Arquitectura de Software

[![.NET 8](https://img.shields.io/badge/.NET-8.0-blueviolet.svg)](https://dotnet.microsoft.com/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docs.docker.com/compose/)
[![Testcontainers](https://img.shields.io/badge/Testing-Testcontainers-00D4A0.svg)](https://testcontainers.com/)

> **Cátedra de Arquitectura de Software · Universidad Popular del Cesar (UPC), 2026**  
> *Material académico de referencia para el estudio, comparación e implementación de arquitecturas orientadas a casos de uso.*

---

## 📑 Tabla de Contenidos

1. [Propósito Pedagógico y Filosofía del Repositorio](#1-propósito-pedagógico-y-filosofía-del-repositorio)
2. [Guía Rápida de Ejecución (Quickstart)](#2-guía-rápida-de-ejecución-quickstart)
   - [Servicios y Puertos](#servicios-y-puertos)
   - [Pruebas Rápidas de la API vía CLI (curl)](#pruebas-rápidas-de-la-api-vía-cli-curl)
3. [Módulo Teórico I: Génesis y Fundamentos de Vertical Slice Architecture](#3-módulo-teórico-i-génesis-y-fundamentos-de-vertical-slice-architecture)
   - [Origen Histórico y Problemática](#origen-histórico-y-problemática)
   - [La Crisis de la Arquitectura en Capas Tradicional (N-Tier / Clean Architecture Dogmática)](#la-crisis-de-la-arquitectura-en-capas-tradicional-n-tier--clean-architecture-dogmática)
   - [Cohesión Técnica vs. Cohesión Funcional](#cohesión-técnica-vs-cohesión-funcional)
   - [El Antipatrón "Shotgun Surgery" (Cirugía de Escopeta)](#el-antipatrón-shotgun-surgery-cirugía-de-escopeta)
   - [La Premisa Central de VSA](#la-premisa-central-de-vsa)
4. [Módulo Teórico II: Principios SOLID Reexaminados bajo VSA](#4-módulo-teórico-ii-principios-solid-reexaminados-bajo-vsa)
   - [Single Responsibility Principle (SRP)](#single-responsibility-principle-srp)
   - [Open/Closed Principle (OCP)](#openclosed-principle-ocp)
   - [Interface Segregation Principle (ISP)](#interface-segregation-principle-isp)
   - [Dependency Inversion Principle (DIP) y la Falacia de la Capa de Repositorios](#dependency-inversion-principle-dip-y-la-falacia-de-la-capa-de-repositorios)
5. [Módulo Teórico III: Decisiones de Diseño y Desmitificación de Dogmas](#5-módulo-teórico-iii-decisiones-de-diseño-y-desmitificación-de-dogmas)
   - [¿Por qué NO existe una Capa de Repositorios ni Servicios de Aplicación?](#por-qué-no-existe-una-capa-de-repositorios-ni-servicios-de-aplicación)
   - [La Falacia de "Cambiar de Base de Datos u ORM"](#la-falacia-de-cambiar-de-base-de-datos-u-orm)
   - [DRY Bien Entendido: Coincidencia Estructural vs. Conocimiento de Negocio](#dry-bien-entendido-coincidencia-estructural-vs-conocimiento-de-negocio)
   - [Por qué la Duplicación de DTOs es una Virtud Arquitectónica](#por-qué-la-duplicación-de-dtos-es-una-virtud-arquitectónica)
   - [Ubicación Estratégica de las Reglas de Negocio](#ubicación-estratégica-de-las-reglas-de-negocio)
   - [Eliminabilidad (Deletability): La Métrica Arquitectónica Clave](#eliminabilidad-deletability-la-métrica-arquitectónica-clave)
6. [Módulo Teórico IV: Anatomía y Mecánica Interna de un Slice (.NET 8)](#6-módulo-teórico-iv-anatomía-y-mecánica-interna-de-un-slice-net-8)
   - [Estructura Física de un Slice](#estructura-física-de-un-slice)
   - [Flujo de Ejecución de una Petición (Request Pipeline)](#flujo-de-ejecución-de-una-petición-request-pipeline)
   - [Autodescubrimiento con `IEndpoint` (Cero Controladores Monolíticos)](#autodescubrimiento-con-iendpoint-cero-controladores-monolíticos)
   - [MediatR y FluentValidation: Interceptores Transversales](#mediatr-y-fluentvalidation-interceptores-transversales)
   - [CQRS Pragmático: Queries Rápidas vs. Commands Transaccionales](#cqrs-pragmático-queries-rápidas-vs-commands-transaccionales)
   - [Traducción de Errores RFC 7807 (ProblemDetails)](#traducción-de-errores-rfc-7807-problemdetails)
7. [Módulo Teórico V: El Frontend en Vertical Slice (Cohesión Espejo)](#7-módulo-teórico-v-el-frontend-en-vertical-slice-cohesión-espejo)
   - [Simetría de Carpetas y Responsabilidad en React](#simetría-de-carpetas-y-responsabilidad-en-react)
   - [Autonomía de Datos: Por qué el Detalle Hace su Propia Petición](#autonomía-de-datos-por-qué-el-detalle-hace-su-propia-petición)
   - [El `SliceInspector`: Trazabilidad Visual en Tiempo Real](#el-sliceinspector-trazabilidad-visual-en-tiempo-real)
8. [Módulo Teórico VI: Estrategia de Pruebas (Testing Vertical sin Mocks)](#8-módulo-teórico-vi-estrategia-de-pruebas-testing-vertical-sin-mocks)
   - [La Trampa de los Mocks en Arquitecturas en Capas](#la-trampa-de-los-mocks-en-arquitecturas-en-capas)
   - [Pruebas de Integración Reales con Testcontainers](#pruebas-de-integración-reales-con-testcontainers)
   - [Qué Probar con Rigor y Qué Evitar Sobreprobar](#qué-probar-con-rigor-y-qué-evitar-sobreprobar)
9. [Matriz Comparativa de Enfoques Arquitectónicos](#9-matriz-comparativa-de-enfoques-arquitectónicos)
10. [Modelo C4 y Documentación Visual](#10-modelo-c4-y-documentación-visual)
11. [Talleres Prácticos y Guía de Laboratorio](#11-talleres-prácticos-y-guía-de-laboratorio)
    - [Taller 1: El Test de Eliminabilidad en Vivo](#taller-1-el-test-de-eliminabilidad-en-vivo)
    - [Taller 2: El Experimento del Cambio Divergente](#taller-2-el-experimento-del-cambio-divergente)
    - [Taller 3: Creación de un Nuevo Slice Guiado Paso a Paso](#taller-3-creación-de-un-nuevo-slice-guiado-paso-a-paso)
    - [Taller 4: Diagnóstico y Prevención de Antipatrones](#taller-4-diagnóstico-y-prevención-de-antipatrones)
12. [Banco de Preguntas de Autoevaluación y Examen](#12-banco-de-preguntas-de-autoevaluación-y-examen)
13. [Glosario de Términos](#13-glosario-de-términos)
14. [Referencias Bibliográficas y Lecturas Recomendadas](#14-referencias-bibliográficas-y-lecturas-recomendadas)

---

## 1. Propósito Pedagógico y Filosofía del Repositorio

En la enseñanza tradicional de la ingeniería de software, las arquitecturas suelen presentarse a través de diagramas en diapositivas con cajas horizontales: *Presentación*, *Lógica de Negocio*, *Acceso a Datos*. Aunque esta abstracción parece ordenada en teoría, en la práctica profesional genera fricción extrema: cada vez que el negocio solicita modificar un requerimiento, los desarrolladores deben navegar y modificar media docena de capas y proyectos distintos.

Este repositorio materializa una alternativa moderna y altamente pragmática: **Vertical Slice Architecture (VSA)**.

### El lema de este demo
> **"Agregar una funcionalidad aquí significa crear una sola carpeta; eliminarla significa borrar esa misma carpeta. No tocar cinco proyectos."**

Cada caso de uso está contenido de forma autocontenida, desde el endpoint HTTP hasta la consulta a la base de datos, pasando por sus reglas de validación y sus modelos de transferencia de datos (DTOs).

---

## 2. Guía Rápida de Ejecución (Quickstart)

### Requisitos previos
- Únicamente **Docker Desktop** (con Docker Compose v2). No es obligatorio tener instalados localmente los SDKs de .NET 8 ni Node.js.

### Puesta en marcha

```bash
# 1. Clonar o ubicarse en el directorio raíz del proyecto
cd vertical-slice

# 2. Configurar variables de entorno (usa los valores por defecto preconfigurados)
cp .env.example .env

# 3. Construir y levantar contenedores en segundo plano o modo interactivo
docker-compose up --build
```

### Servicios y Puertos

Una vez los contenedores alcancen el estado `healthy`, accede a las siguientes direcciones:

| Servicio | URL Local | Descripción Técnica |
|---|---|---|
| **Frontend Web** | [http://localhost:5173](http://localhost:5173) | SPA en React 18 + Vite + Tailwind CSS con telemetría de slices. |
| **API Backend** | [http://localhost:5000](http://localhost:5000) | Web API .NET 8 con Minimal APIs y arquitectura vertical. |
| **Swagger UI** | [http://localhost:5000/swagger](http://localhost:5000/swagger) | Especificación interactiva OpenAPI de los cinco endpoints. |
| **Health Check** | [http://localhost:5000/health](http://localhost:5000/health) | Endpoint de sondeo del estado de salud del backend. |
| **Base de Datos** | `localhost:5432` | PostgreSQL 16 (`catalogo_db`, usuario `postgres`, pass `postgres`). |

> **Sembrado automático de datos:** La base de datos se inicializa automáticamente con **10 productos de muestra** categorizados (Componentes, Periféricos, etc.) mediante [DatabaseSeeder.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Persistence/DatabaseSeeder.cs), garantizando que las demostraciones en clase nunca comiencen con una interfaz vacía.

Para reiniciar el entorno y restaurar el estado inicial en cualquier momento:
```bash
docker-compose down -v   # Elimina contenedores y volúmenes de PostgreSQL
docker-compose up        # Reconstruye, aplica migraciones y resiembra los 10 productos
```

---

### Pruebas Rápidas de la API vía CLI (`curl`)

Puedes interactuar con los cinco slices directamente desde tu terminal:

```bash
# 1. LISTAR CATÁLOGO (Slice: ListProducts)
curl -i http://localhost:5000/api/products

# 1.1 Filtrar por categoría y búsqueda textual (insensible a acentos/mayúsculas)
curl "http://localhost:5000/api/products?categoria=Periféricos"
curl "http://localhost:5000/api/products?buscar=mecanico"

# 2. CONSULTAR DETALLE POR ID (Slice: GetProductById)
# (Reemplaza {id} por un GUID obtenido del listado)
curl -i http://localhost:5000/api/products/{id}

# 3. CREAR UN PRODUCTO NUEVO (Slice: CreateProduct)
curl -i -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Teclado Ergonómico Split",
    "sku": "PER-TEC-099",
    "categoria": "Periféricos",
    "precio": 320000,
    "stock": 15,
    "descripcion": "Teclado mecánico dividido con switches silenciosos."
  }'

# 4. AJUSTAR EXISTENCIAS DE STOCK (Slice: UpdateProductStock)
# El ajuste representa un MOVIMIENTO relativo con signo (+ o -), no un reemplazo absoluto:
curl -i -X PATCH http://localhost:5000/api/products/{id}/stock \
  -H "Content-Type: application/json" \
  -d '{"ajuste": -5}'

# Intentar retirar más stock del existente (Demuestra la regla de negocio y RFC 7807 422 Unprocessable):
curl -i -X PATCH http://localhost:5000/api/products/{id}/stock \
  -H "Content-Type: application/json" \
  -d '{"ajuste": -9999}'

# 5. ELIMINAR PRODUCTO (Slice: DeleteProduct)
curl -i -X DELETE http://localhost:5000/api/products/{id}
```

---

## 3. Módulo Teórico I: Génesis y Fundamentos de Vertical Slice Architecture

### Origen Histórico y Problemática

A mediados de la década de 2010, **Jimmy Bogard** (creador de librerías emblemáticas en el ecosistema .NET como MediatR y AutoMapper) formalizó el concepto de **Vertical Slice Architecture** tras observar un patrón recurrente de frustración en equipos empresariales:

> *"Clean Architecture y Onion Architecture nacieron con excelentes intenciones: desacoplar la lógica de dominio de los detalles de infraestructura. Sin embargo, en el 90% de las aplicaciones comerciales, el resultado no fue desacoplamiento, sino una burocracia de capas que encareció brutalmente el costo de cualquier cambio funcional."*

### La Crisis de la Arquitectura en Capas Tradicional (N-Tier / Clean Architecture Dogmática)

En una arquitectura en capas tradicional (o una implementación dogmática de Clean Architecture), el sistema se divide horizontalmente por preocupaciones técnicas:

```
┌────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN                      │  Controllers, Filters, ViewModels
├────────────────────────────────────────────────────────┤
│              CAPA DE APLICACIÓN                        │  Services, CommandHandlers, DTOs
├────────────────────────────────────────────────────────┤
│              CAPA DE DOMINIO                           │  Entities, ValueObjects, Domain Services
├────────────────────────────────────────────────────────┤
│              CAPA DE INFRAESTRUCTURA                   │  Repositories, DbContext, Mappers
└────────────────────────────────────────────────────────┘
```

Esta organización asume implícitamente que los componentes de una misma capa técnica cambian juntos o comparten más entre sí que con las otras capas. **En la vida real ocurre exactamente lo contrario:**
- Cuando cambia la forma de crear un producto, no cambian todos los controladores del sistema.
- Cambia la petición HTTP de creación, el validador de creación, la consulta SQL de inserción y la respuesta de creación.

### Cohesión Técnica vs. Cohesión Funcional

En ciencias de la computación, la **cohesión** mide qué tan estrechamente relacionadas están las responsabilidades dentro de un módulo:

1. **Cohesión Técnica (Baja cohesión funcional):** Agrupar archivos porque *"todos son controladores"*, *"todos son repositorios"* o *"todos son interfaces"*.  
   *Consecuencia:* Un controlador de productos comparte carpeta con un controlador de facturación solo porque ambos heredan de `ControllerBase`, a pesar de no tener ninguna relación de negocio.
2. **Cohesión Funcional (Alta cohesión por caso de uso):** Agrupar todos los elementos necesarios para cumplir un único objetivo de negocio en una misma unidad modular.  
   *En VSA:* Todo lo que cambia junto con el caso de uso `CreateProduct` vive junto en la carpeta `Features/CreateProduct/`.

```
ARQUITECTURA EN CAPAS (División Horizontal)
┌───────────────────────────────────────────────────────────────┐
│ Controllers:   [ ListProducts ] [ CreateProduct ] [ Checkout ] │
├───────────────────────────────────────────────────────────────┤
│ Services:      [ ProductService ]                [ OrderServ ]│
├───────────────────────────────────────────────────────────────┤
│ Repositories:  [ ProductRepository ]             [ OrderRepo ]│
└───────────────────────────────────────────────────────────────┘
          ▲ Cada funcionalidad atraviesa todas las capas,
            esparciendo el código en múltiples carpetas.

VERTICAL SLICE ARCHITECTURE (División Vertical)
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ListProducts   │ │  CreateProduct  │ │    Checkout     │
│ ─────────────── │ │ ─────────────── │ │ ─────────────── │
│ • Endpoint      │ │ • Endpoint      │ │ • Endpoint      │
│ • Request/Res   │ │ • Request/Res   │ │ • Request/Res   │
│ • Query directa │ │ • Validator     │ │ • Validator     │
│                 │ │ • Handler + SQL │ │ • Handler + Tx  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          ▲ Cada slice contiene su pila completa de ejecución.
            Alta cohesión funcional y bajo acoplamiento externo.
```

### El Antipatrón "Shotgun Surgery" (Cirugía de Escopeta)

El término **Shotgun Surgery** (catalogado por Martin Fowler en su catálogo de *Code Smells*) describe el fenómeno donde introducir un cambio simple en un requerimiento exige realizar múltiples modificaciones pequeñas dispersas a lo largo de muchos archivos y capas.

En una arquitectura en capas típica:
1. Abrir `CreateProductDto.cs` en la capa de contratos.
2. Modificar `IProductService.cs` y su implementación `ProductService.cs` en la capa de aplicación.
3. Modificar `IProductRepository.cs` y su implementación `ProductRepository.cs` en infraestructura.
4. Ajustar el mapeo en AutoMapper.
5. Modificar `ProductsController.cs` en la capa web.
6. Recompilar 4 proyectos distintos.

En **Vertical Slice Architecture**:
- Abres la carpeta `Features/CreateProduct/`.
- Modificas los archivos afectados dentro de esa carpeta.
- Listo. Ningún otro archivo del repositorio se entera.

### La Premisa Central de VSA

> **"Minimizar el acoplamiento entre slices (rebanadas) y maximizar la cohesión dentro de cada slice."**

Cada slice es libre de elegir la estrategia técnica más adecuada para su problema particular:
- Un slice de lectura puede limitarse a una consulta SQL optimizada proyectada a un DTO.
- Un slice de transacción financiera compleja puede implementar un modelo de dominio rico con agregados y eventos.
- No hay un molde uniforme forzado para todos los casos de uso.

---

## 4. Módulo Teórico II: Principios SOLID Reexaminados bajo VSA

Vertical Slice Architecture no contradice los principios SOLID; por el contrario, los aplica a nivel de **casos de uso** y límites funcionales reales, evitando la fragmentación técnica superficial.

### Single Responsibility Principle (SRP)
- **Interpretación errónea habitual:** *"Una clase solo debe hacer una cosa técnica"* (por ejemplo, solo mapear, solo validar, solo consultar la BD), lo que genera una explosión de clases diminutas sin valor individual.
- **Definición rigurosa de Robert C. Martin (Uncle Bob):** *"Un módulo debe tener una, y solo una, razón para cambiar; es decir, debe responder a un único actor o caso de uso."*
- **En VSA:** El slice `CreateProduct` cambia únicamente cuando cambia la regla o el contrato de creación de productos. Todos los artefactos que participan en esa decisión están confinados en la misma carpeta.

### Open/Closed Principle (OCP)
- *"El software debe estar abierto a la extensión, pero cerrado a la modificación."*
- **En VSA:** ¿Cómo se agrega el caso de uso número 6 al catálogo?  
  Creando la carpeta `Features/NuevoCasoDeUso/`. No se modifica ningún controlador existente, ni ninguna interfaz común, ni ningún servicio existente. El sistema se extiende por **adición**, no por modificación de código previo.

### Interface Segregation Principle (ISP)
- *"Ningún cliente debe ser forzado a depender de métodos que no utiliza."*
- **La violación clásica en capas:** Una interfaz monolítica `IProductRepository` que expone 15 métodos:
  ```csharp
  public interface IProductRepository {
      Task<Product> GetByIdAsync(Guid id);
      Task<List<Product>> ListAsync();
      Task AddAsync(Product p);
      Task UpdateStockAsync(Guid id, int qty);
      Task DeleteAsync(Guid id);
      Task<List<Product>> SearchByCategoryAsync(string cat);
      // ... 10 métodos más
  }
  ```
  El caso de uso `DeleteProduct` solo necesita un método, pero depende de una interfaz que conoce toda la gama de operaciones posibles.
- **En VSA:** No hay interfaces compartidas de repositorio. Cada slice implementa su propio contrato específico `IRequestHandler<TRequest, TResponse>`, segregado al 100%.

### Dependency Inversion Principle (DIP) y la Falacia de la Capa de Repositorios
- *"Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones."*
- En .NET moderno con Entity Framework Core:
  - `DbContext` ya es una implementación del patrón **Unit of Work**.
  - `DbSet<T>` ya es una implementación del patrón **Repository**.
  - `IQueryable<T>` ya es una implementación del patrón **Specification**.
- Crear una interfaz `IProductRepository` encima de `DbSet<Product>` es crear una abstracción innecesaria encima de otra abstracción madura. VSA promueve inyectar directamente `AppDbContext` en los handlers, eliminando capas vacías de indirección.

---

## 5. Módulo Teórico III: Decisiones de Diseño y Desmitificación de Dogmas

### ¿Por qué NO existe una Capa de Repositorios ni Servicios de Aplicación?

Observa cómo consulta datos el handler [ListProductsHandler.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/ListProducts/ListProductsHandler.cs):

```csharp
var consulta = db.Products.AsNoTracking();

if (!string.IsNullOrWhiteSpace(request.Categoria))
    consulta = consulta.Where(p => p.Categoria == request.Categoria);

return await consulta
    .OrderBy(p => p.Nombre)
    .Select(p => new ListProductsResponse(p.Id, p.Nombre, p.Sku, p.Categoria, p.Precio, p.Stock))
    .ToListAsync(cancellationToken);
```

Envolver esto en `IProductRepository.ListProductsAsync(...)` traería los siguientes problemas:
1. **Pérdida de capacidad de composición:** `IQueryable` permite componer dinámicamente filtros, ordenamiento y paginación en base de datos. Un repositorio tradicional o bien fuerza a traer entidades completas a memoria (ineficiente) o bien requiere agregar un nuevo método a la interfaz por cada combinación de filtros.
2. **Indirección vacía:** El método del repositorio terminaría siendo un pasamanos de 3 líneas que solo llama a `db.Products.ToListAsync()`.

### La Falacia de "Cambiar de Base de Datos u ORM"

Uno de los argumentos más escuchados en clase para justificar capas de repositorio es:  
*"¿Y si mañana cambiamos PostgreSQL por MongoDB, o EF Core por Dapper?"*

**Análisis de realidad en ingeniería de software:**
1. **Frecuencia empírica:** Las empresas cambian de base de datos relacional central con una frecuencia cercana a cero en comparación con la frecuencia de cambio de requerimientos de negocio.
2. **Falso desacoplamiento:** Si cambias de una base de datos relacional (PostgreSQL) a una orientada a documentos (MongoDB), el modelo conceptual de datos cambia radicalmente (relaciones vs. agregados embebidos, transacciones ACID vs. consistencia eventual). Una interfaz de repositorio basada en entidades relacionales rara vez sobrevive intacta a esa migración.
3. **Costo pagado por adelantado:** Se paga un costo de complejidad, lentitud y mantenimiento diario durante años para mitigar un riesgo hipotético que casi nunca ocurre.
4. **VSA facilita la migración selectiva:** Si un caso de uso específico (`ListProducts`) requiere el rendimiento extremo de Dapper o raw SQL, VSA permite usar Dapper **únicamente en ese slice**, sin tener que migrar ni arriesgar los otros cuatro slices.

### DRY Bien Entendido: Coincidencia Estructural vs. Conocimiento de Negocio

El principio **DRY (Don't Repeat Yourself)**, introducido por Dave Thomas y Andy Hunt en *The Pragmatic Programmer*, suele malinterpretarse como: *"Si dos fragmentos de código se parecen, deben unificarse inmediatamente"*.

Thomas y Hunt clarificaron explícitamente:
> *"DRY trata sobre la duplicación de CONOCIMIENTO de negocio, no sobre la duplicación de texto o coincidencia estructural."*

- **Duplicación de Conocimiento (Peligrosa):** Si la fórmula para calcular el IVA o el descuento de un producto está escrita en tres lugares distintos, un cambio legal obligará a cazar las tres copias. Eso viola DRY.
- **Coincidencia Estructural (Inofensiva y deseable):** Si dos DTOs tienen casualmente los mismos campos (`Id`, `Nombre`, `Precio`) en un momento dado, unificarlos genera un acoplamiento accidental entre dos casos de uso independientes.

### Por qué la Duplicación de DTOs es una Virtud Arquitectónica

En este proyecto:
- [ListProductsResponse.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/ListProducts/ListProductsResponse.cs) define los campos devueltos al listar.
- [GetProductByIdResponse.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/GetProductById/GetProductByIdResponse.cs) define los campos devueltos en el detalle.

Hoy ambos tienen propiedades similares. Sin embargo, **está terminantemente prohibido fusionarlos en un `ProductDto` compartido**.

**¿Por qué?**
El día de mañana, el negocio solicita:
- *"El modal de detalle debe mostrar un historial de auditoría y la lista de proveedores asociados"*.
- *"El listado del catálogo debe mantenerse ultra-ligero para no saturar conexiones móviles"*.

Si existe un `ProductDto` compartido:
- El desarrollador se ve tentado a agregar campos anulables (`List<Proveedor>?`) al DTO común.
- El listado comienza a transferir datos nulos innecesarios o a ejecutar consultas costosas que no necesita.
- Cualquier cambio en el detalle pone en riesgo de regresión al catálogo general.

> **Regla de oro de VSA:**  
> **Duplicar contratos y modelos de transferencia de datos es barato; acoplar el ciclo de vida de casos de uso independientes es costoso.**

### Ubicación Estratégica de las Reglas de Negocio

Observa la regla en [UpdateProductStockHandler.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/UpdateProductStock/UpdateProductStockHandler.cs):

```csharp
var stockAnterior = producto.Stock;
var stockNuevo = stockAnterior + request.Ajuste;

// La regla de stock no negativo vive AQUÍ, no en Domain/Product.cs:
// es la única operación del sistema que puede violarla. Subirla al
// dominio la haría visible para cuatro slices a los que no les concierne.
if (stockNuevo < 0)
{
    throw new BusinessRuleException(
        $"El ajuste dejaría el stock en {stockNuevo}. Disponible actualmente: {stockAnterior}.");
}
```

En DDD dogmático se insistiría en encapsular esto dentro de un método `Product.DisminuirStock(...)`.  
En VSA, si la operación de ajuste relativo solo existe en este caso de uso, ubicar la validación en el handler mantiene la entidad [Product.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Domain/Product.cs) como un modelo de persistencia limpio y libre de métodos que los demás slices no necesitan invocar.

### Eliminabilidad (Deletability): La Métrica Arquitectónica Clave

La mayoría de métricas arquitectónicas evalúan la facilidad para **construir** software. VSA prioriza una propiedad más difícil: la facilidad para **desmantelar o eliminar** código sin efectos secundarios.

En una arquitectura tradicional con controladores compartidos y servicios polivalentes:
- Borrar una funcionalidad exige editar `ProductsController.cs`, `IProductService.cs`, `ProductService.cs`, `IProductRepository.cs`, etc.
- El riesgo de romper rutas adyacentes o dejar código muerto es muy alto.

En este repositorio:
```bash
# Eliminar por completo el slice de consulta individual:
rm -rf apps/backend/Features/GetProductById
cd apps/backend && dotnet build
```
**El proyecto compila sin errores a la primera.** Ningún otro slice referenciaba esa carpeta, y el mecanismo de enrutamiento retira el endpoint automáticamente.

---

## 6. Módulo Teórico IV: Anatomía y Mecánica Interna de un Slice (.NET 8)

### Estructura Física de un Slice

Tomemos como referencia la carpeta [CreateProduct](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/CreateProduct/):

```
apps/backend/Features/CreateProduct/
├── CreateProductRequest.cs     # Contrato de entrada (IRequest<CreateProductResponse>)
├── CreateProductResponse.cs    # Contrato de salida (record inmutable)
├── CreateProductValidator.cs   # Reglas de validación declarativas (FluentValidation)
├── CreateProductHandler.cs     # Lógica de orquestación y persistencia directa
└── CreateProductEndpoint.cs    # Mapeo HTTP (Minimal API implementando IEndpoint)
```

Compara esto con [DeleteProduct](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/DeleteProduct/):
```
apps/backend/Features/DeleteProduct/
├── DeleteProductRequest.cs     # Entrada: solo el Guid Id
├── DeleteProductHandler.cs     # Handler: busca y elimina
└── DeleteProductEndpoint.cs    # Endpoint: DELETE /api/products/{id} -> 204 No Content
```
**No hay archivos sobrantes:** `DeleteProduct` no necesita DTO de respuesta (devuelve `204 NoContent`) ni validador complejo (el enrutador valida el tipo Guid). Cada slice tiene **exactamente los archivos que su problema requiere**, sin forzar plantillas homogéneas vacías.

---

### Flujo de Ejecución de una Petición (Request Pipeline)

El siguiente diagrama detalla cómo viaja una petición desde el cliente HTTP hasta la base de datos a través del pipeline de la aplicación:

```
[ Cliente HTTP (curl / React) ]
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Minimal API Endpoint (CreateProductEndpoint)                 │
│    Recibe el payload JSON y lo enlaza con CreateProductRequest  │
└──────────────────────────────────┬──────────────────────────────┘
                                   │ app.MapPost(...)
                                   │ mediator.Send(request)
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Pipeline Behavior Transversal (ValidationBehavior)           │
│    Ejecuta CreateProductValidator vía FluentValidation          │
│    ¿Hay errores? ──► SÍ ──► Lanza ValidationException           │
│         │ NO                                                    │
└─────────┼───────────────────────────────────────────────────────┘
          │ next()
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Handler del Slice (CreateProductHandler)                     │
│    • Verifica unicidad de SKU en AppDbContext                   │
│    • Si existe duplicado: lanza ConflictException               │
│    • Instancia la entidad Product                               │
│    • db.Products.Add(producto) + await db.SaveChangesAsync()    │
│    • Retorna CreateProductResponse                              │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Manejo Global de Excepciones (ExceptionHandler)              │
│    Si ocurrió alguna excepción en el camino, se traduce al      │
│    estándar RFC 7807 (ProblemDetails):                          │
│    • ValidationException  ──► 400 Bad Request                   │
│    • NotFoundException    ──► 404 Not Found                     │
│    • ConflictException    ──► 409 Conflict                      │
│    • BusinessRuleException──► 422 Unprocessable Entity          │
└─────────────────────────────────────────────────────────────────┘
```

---

### Autodescubrimiento con `IEndpoint` (Cero Controladores Monolíticos)

Para no depender de un `ProductsController` que agrupe todos los endpoints en un único archivo de cientos de líneas, el sistema define una interfaz de marcado en [IEndpoint.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Common/IEndpoint.cs):

```csharp
namespace VerticalSlice.Api.Common;

public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
```

Cada slice implementa esta interfaz en su propio archivo `*Endpoint.cs`:

```csharp
public class CreateProductEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/products", async (CreateProductRequest request, ISender mediator) =>
        {
            var resultado = await mediator.Send(request);
            return Results.Created($"/api/products/{resultado.Id}", resultado);
        })
        .WithName("CreateProduct")
        .WithTags("Productos");
    }
}
```

En [Program.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Program.cs), una rutina de reflexión escanea el ensamblado al arrancar la aplicación y registra automáticamente todos los endpoints encontrados:

```csharp
static void MapearEndpointsDeLosSlices(WebApplication app)
{
    var endpoints = Assembly.GetExecutingAssembly().GetTypes()
        .Where(t => typeof(IEndpoint).IsAssignableFrom(t) && t is { IsInterface: false, IsAbstract: false })
        .Select(Activator.CreateInstance)
        .Cast<IEndpoint>();

    foreach (var endpoint in endpoints)
    {
        endpoint.MapEndpoint(app);
    }
}
```

---

### MediatR y FluentValidation: Interceptores Transversales

> **Aclaración conceptual crítica:**  
> **MediatR no es la arquitectura.** MediatR es simplemente un despachador en memoria que facilita la implementación del patrón Mediator y permite insertar interceptores (*Pipeline Behaviors*) antes de los handlers. Un sistema que llame directamente al handler desde el endpoint sigue siendo 100% Vertical Slice Architecture.

El único comportamiento transversal (*cross-cutting concern*) del backend está en [ValidationBehavior.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Common/ValidationBehavior.cs):

```csharp
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validadores)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!validadores.Any()) return await next();

        var contexto = new ValidationContext<TRequest>(request);
        var resultados = await Task.WhenAll(validadores.Select(v => v.ValidateAsync(contexto, ct)));
        var errores = resultados.SelectMany(r => r.Errors).Where(e => e is not null).ToList();

        if (errores.Count != 0)
            throw new ValidationException(errores);

        return await next();
    }
}
```
Esto garantiza que **ningún handler se ejecuta si los datos de entrada violan las reglas sintácticas**, manteniendo el código de los handlers enfocado únicamente en la lógica de negocio.

---

### CQRS Pragmático: Queries Rápidas vs. Commands Transaccionales

VSA adopta de forma natural los principios de **CQRS (Command Query Responsibility Segregation)** sin necesidad de bases de datos separadas ni buses de eventos complejos:

| Aspecto | Slices de Consulta (Queries) | Slices de Mutación (Commands) |
|---|---|---|
| **Ejemplos** | `ListProducts`, `GetProductById` | `CreateProduct`, `UpdateProductStock`, `DeleteProduct` |
| **Seguimiento EF** | `.AsNoTracking()` (Cero sobrecarga de memoria) | Change Tracker activo para detectar mutaciones |
| **Proyección** | Directa a DTO con `.Select()` en SQL | Instanciación de entidades con validaciones de invariantes |
| **Validadores** | Innecesarios o mínimos (ej. validar formatos) | Estrictos (FluentValidation + comprobaciones de unicidad) |

---

### Traducción de Errores RFC 7807 (ProblemDetails)

El estándar **RFC 7807** normaliza cómo las APIs HTTP comunican errores al cliente. En lugar de devolver cadenas de texto planas o páginas HTML de error 500, [ExceptionHandler.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Common/ExceptionHandler.cs) intercepta las excepciones de dominio tipadas en [Excepciones.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Common/Excepciones.cs) y produce respuestas consistentes:

```json
{
  "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
  "title": "Recurso no encontrado",
  "status": 404,
  "detail": "No existe un producto con Id 3fa85f64-5717-4562-b3fc-2c963f66afa6."
}
```

---

## 7. Módulo Teórico V: El Frontend en Vertical Slice (Cohesión Espejo)

### Simetría de Carpetas y Responsabilidad en React

Uno de los errores habituales al enseñar arquitecturas limpias es aplicarlas solo en el backend, dejando el cliente web como una masa desordenada de componentes globales. En este proyecto, el frontend React refleja la misma estructura vertical:

```
apps/frontend/src/features/
├── list-products/          # Slice: Catálogo, filtros, cuadrícula de tarjetas
├── get-product-by-id/      # Slice: Modal de detalle autónomo
├── create-product/         # Slice: Formulario modal de alta y validaciones locales
├── update-product-stock/   # Slice: Pantalla de ajuste de existencias (movimientos)
└── delete-product/         # Slice: Diálogo modal de confirmación y borrado
```

Cada carpeta del frontend contiene sus propios hooks, tipos, componentes y llamadas API.

---

### Autonomía de Datos: Por qué el Detalle Hace su Propia Petición

Cuando un usuario hace clic en una tarjeta de producto en el catálogo:
- El catálogo ya tiene en memoria datos como el nombre y el precio.
- Sin embargo, [ProductDetailModal.tsx](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/frontend/src/features/get-product-by-id/ProductDetailModal.tsx) realiza una petición HTTP explícita a `GET /api/products/{id}`.

**¿Por qué se tomó esta decisión de diseño?**
1. **Desacoplamiento de estado:** Si el detalle dependiera del estado global del catálogo, ambas vistas quedarían acopladas. Si en el futuro el detalle muestra campos que el catálogo no consulta, habría que modificar el slice de listado para alimentar al detalle.
2. **Frescura de datos:** Al abrir el detalle, se obtienen las existencias más recientes directamente de la base de datos, evitando mostrar información obsoleta si otro usuario modificó el inventario concurrentemente.
3. **Consistencia arquitectónica:** Cada slice es dueño soberano de su acceso a datos, tanto en el backend como en el cliente.

---

### El `SliceInspector`: Trazabilidad Visual en Tiempo Real

Para reforzar el aprendizaje en el aula, la aplicación web incluye en la parte superior el componente [SliceInspector.tsx](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/frontend/src/components/layout/SliceInspector.tsx).

Cada vez que el estudiante interactúa con la interfaz (abre el catálogo, filtra, ajusta stock o elimina un producto), el inspector intercepta la llamada HTTP y muestra:
- La carpeta del backend que atendió la solicitud (ej. `Features/UpdateProductStock`).
- El método HTTP y la URL invocada (`PATCH /api/products/{id}/stock`).
- El código de estado HTTP resultante (`200 OK` o `422 Unprocessable`).

Esta telemetría visual convierte la teoría abstracta de diapositivas en una experiencia interactiva inmediata.

---

## 8. Módulo Teórico VI: Estrategia de Pruebas (Testing Vertical sin Mocks)

### La Trampa de los Mocks en Arquitecturas en Capas

En proyectos organizados en capas, es común encontrar suites con cientos de "pruebas unitarias" que siguen este patrón:

```csharp
// Antipatrón: Probar que el mock devuelve lo que le configuramos al mock
var mockRepo = new Mock<IProductRepository>();
mockRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(new Product { Id = id });
var service = new ProductService(mockRepo.Object);

var resultado = await service.GetByIdAsync(id);

Assert.NotNull(resultado);
mockRepo.Verify(r => r.GetByIdAsync(id), Times.Once); // ¿Qué valor aportó esta prueba?
```

Este tipo de pruebas presenta serios defectos:
1. **Prueban la implementación, no el comportamiento:** Si refactorizas el código interno sin cambiar los requerimientos, los mocks se rompen (*pruebas frágiles*).
2. **Falsa sensación de seguridad:** La prueba pasa en verde aunque la consulta SQL real en PostgreSQL falle por un índice roto, un tipo de dato incompatible o una violación de clave foránea.
3. **Alto costo de mantenimiento:** Crear y actualizar configuraciones de mocks consume tiempo que debería dedicarse a validar lógica de negocio.

---

### Pruebas de Integración Reales con Testcontainers

En Vertical Slice, la unidad de prueba natural es el **caso de uso completo**. Las pruebas se ubican en `apps/backend.tests/` y utilizan **Testcontainers**:

```
[ Prueba de Integración ]
         │ (HTTP Request vía HttpClient)
         ▼
[ WebApplicationFactory (.NET) ]
         │ (Pipeline completo: Minimal API -> Validation -> Handler -> EF Core)
         ▼
[ Contenedor Docker Efímero con PostgreSQL 16 Real ]
```

Observa la configuración en [CatalogoApiFactory.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend.tests/CatalogoApiFactory.cs):

```csharp
public class CatalogoApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("catalogo_pruebas")
        .Build();

    public async Task InitializeAsync() => await _postgres.StartAsync();
    // ...
}
```

**Ventajas clave:**
- **Cero dobles de prueba:** No hay un solo mock en toda la suite de pruebas.
- **Validación de constraints reales de base de datos:** Se comprueba el índice único de SKU en PostgreSQL y las transacciones atómicas.
- **Pruebas de alta fidelidad:** Si la prueba pasa, el código funciona exactamente igual en producción.

Para ejecutar las pruebas localmente:
```bash
cd apps/backend.tests
dotnet test
```

---

### Qué Probar con Rigor y Qué Evitar Sobreprobar

En este proyecto, las 10 pruebas de integración se concentran en los dos slices que contienen reglas de negocio e invariantes críticas:
1. `CreateProductTests.cs`:
   - Creación exitosa con código 201 y persistencia real en base de datos.
   - Rechazo por violación de formato (campos requeridos, precio <= 0).
   - Rechazo por colisión de SKU único (código 409 Conflict).
2. `UpdateProductStockTests.cs`:
   - Incremento y decremento válido de stock.
   - Rechazo inmediato de ajuste que deje el stock en negativo (código 422 BusinessRuleException).
   - Manejo de producto inexistente (código 404 Not Found).

Los slices de consulta simple (`ListProducts`, `GetProductById`) tienen un valor pedagógico menor al probarse de forma exhaustiva, pues no albergan ramificaciones condicionales de negocio.

---

## 9. Matriz Comparativa de Enfoques Arquitectónicos

Para que los estudiantes evalúen cuándo adoptar cada arquitectura en proyectos reales de la industria:

| Criterio de Comparación | Arquitectura Monolítica en Capas (N-Tier) | Clean / Hexagonal Architecture Clásica | Vertical Slice Architecture (VSA) | Microservicios |
|---|---|---|---|---|
| **Eje de Agrupación** | Técnico horizontal (Controllers, Services, Repos) | Técnico concéntrico (Domain, App, Infra, Web) | **Funcional vertical por Caso de Uso (Features)** | Servicio distribuido por Bounded Context |
| **Cohesión** | Baja cohesión funcional; alta cohesión técnica artificial | Cohesión moderada; lógica de un caso de uso dispersa en 4 capas | **Máxima cohesión funcional dentro del slice** | Alta dentro del servicio; fragmentada en la red |
| **Acoplamiento** | Alto acoplamiento transversal entre capas | Moderado (controlado mediante inversión de dependencias) | **Mínimo acoplamiento entre slices** | Bajo acoplamiento de código; alto acoplamiento de red/redes |
| **Impacto de Cambios (Shotgun Surgery)** | Muy alto (tocar múltiples carpetas/proyectos) | Alto (tocar Domain, Application e Infrastructure) | **Mínimo (modificar una sola carpeta del slice)** | Variable (puede requerir coordinar múltiples despliegues) |
| **Facilidad de Eliminación (Deletability)** | Muy difícil; riesgo alto de código muerto | Difícil; interfaces y servicios cruzados | **Inmediata (`rm -rf` de la carpeta del slice)** | Fácil a nivel de servicio; compleja a nivel de dependencias |
| **Estrategia de Testing Predominante** | Pruebas unitarias con mocks excesivos | Pruebas unitarias de dominio + tests de puertos/adaptadores | **Pruebas de integración verticales reales (sin mocks)** | Pruebas de contrato, end-to-end distribuidas |
| **Costo Cognitivo y Burocracia** | Moderado-Alto | Alto (decenas de mappers, DTOs y abstracciones) | **Bajo (el flujo completo cabe en una pantalla)** | Muy alto (redes, observabilidad distribuida, RPC) |
| **Curva de Aprendizaje del Equipo** | Baja (muy común, pero conduce a código espagueti) | Alta (requiere disciplina estricta para no fugar dependencias) | **Moderada-Baja (muy intuitiva para nuevos desarrolladores)** | Muy alta (requiere dominar DevOps e infraestructura) |
| **Riesgo Principal** | Acumulación de capas pasantes y servicios gigantes | Sobreingeniería y abstracción prematura | Duplicación descontrolada si no se vigila la regla de los 3 strikes | Complejidad operativa y latencia de red inmanejable |

---

## 10. Modelo C4 y Documentación Visual

El proyecto documenta su arquitectura mediante el **Modelo C4** (Contexto, Contenedores, Componentes y Código), ideado por Simon Brown. Los diagramas residen en la carpeta [docs/](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/docs/):

```
docs/
├── c4-nivel1.png                        # Nivel 1: Contexto del Sistema
├── c4-nivel2.png                        # Nivel 2: Contenedores
├── c4-nivel3.png                        # Nivel 3: Componentes (Slices vs. Common)
├── c4-nivel4-crear-producto.png         # Nivel 4: Código (Anatomía del slice CreateProduct)
├── arquitectura-vertical-slice.html     # Visor web interactivo de arquitectura
└── slices-lamina-por-lamina.html        # Presentación interactiva de diapositivas para clase
```

### Resumen de los 4 Niveles en este Proyecto

1. **Nivel 1 (Contexto):** Muestra cómo el usuario final (administrador de catálogo o cliente) interactúa con el sistema de catálogo de productos como una caja negra.
2. **Nivel 2 (Contenedores):** Ilustra los tres bloques de despliegue principales:
   - Contenedor Frontend (React 18 + Vite en puerto 5173).
   - Contenedor Backend (ASP.NET Core 8 Web API en puerto 5000).
   - Contenedor de Base de Datos (PostgreSQL 16 en puerto 5432).
3. **Nivel 3 (Componentes):** Detalla la organización interna del backend en .NET:
   - Los cinco slices independientes: `ListProducts`, `GetProductById`, `CreateProduct`, `UpdateProductStock`, `DeleteProduct`.
   - El bloque transversal `Common` (`IEndpoint`, `ValidationBehavior`, `ExceptionHandler`).
   - El bloque de persistencia compartida `Persistence` (`AppDbContext`, `Product`).
4. **Nivel 4 (Código):** Desglosa la anatomía microscópica de un slice (`CreateProduct`): relación entre `CreateProductEndpoint`, `CreateProductRequest`, `CreateProductValidator`, `CreateProductHandler` y `CreateProductResponse`.

---

## 11. Talleres Prácticos y Guía de Laboratorio

Instrucciones diseñadas para que los estudiantes ejecuten experimentos en sus computadores y comprueben empíricamente las propiedades del sistema.

### Taller 1: El Test de Eliminabilidad en Vivo

**Objetivo:** Comprobar que en Vertical Slice los casos de uso son verdaderamente autónomos y su eliminación no produce errores en cascada.

1. Detén el contenedor o ejecuta en un entorno local:
   ```bash
   # Borra por completo el slice GetProductById
   rm -rf apps/backend/Features/GetProductById
   ```
2. Recompila el proyecto del backend:
   ```bash
   cd apps/backend
   dotnet build
   ```
3. **Preguntas de reflexión para el estudiante:**
   - ¿Por qué el proyecto compiló sin errores a pesar de haber eliminado una funcionalidad completa?
   - ¿Qué habría pasado en una arquitectura tradicional con un `ProductsController` que contenía el método `GetById(Guid id)`?
4. Restaura el código al finalizar:
   ```bash
   git checkout apps/backend/Features/GetProductById
   ```

---

### Taller 2: El Experimento del Cambio Divergente

**Objetivo:** Demostrar por qué los DTOs de salida no deben compartirse entre diferentes casos de uso.

1. Abre el archivo [GetProductByIdResponse.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/GetProductById/GetProductByIdResponse.cs).
2. Agrega una nueva propiedad de prueba, por ejemplo `string SkuNormalizado`:
   ```csharp
   public record GetProductByIdResponse(
       Guid Id,
       string Nombre,
       string Sku,
       string Categoria,
       decimal Precio,
       int Stock,
       string Descripcion,
       string SkuNormalizado);
   ```
3. Actualiza únicamente el archivo [GetProductByIdHandler.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Features/GetProductById/GetProductByIdHandler.cs) para asignar ese valor (`producto.Sku.ToUpperInvariant()`).
4. Recompila: `dotnet build`.
5. **Preguntas de reflexión para el estudiante:**
   - ¿Afectó este cambio al slice `ListProducts`?
   - ¿Qué habría sucedido si ambos slices compartieran una clase única `ProductDto` utilizada en todo el sistema?

---

### Taller 3: Creación de un Nuevo Slice Guiado Paso a Paso

**Objetivo:** Implementar desde cero una nueva funcionalidad siguiendo estrictamente el estándar de Vertical Slice.

**Requerimiento de negocio:** Implementar el caso de uso **Desactivar Producto** (`POST /api/products/{id}/desactivar`), el cual debe marcar una propiedad booleana `Activo = false` en el producto.

#### Pasos en el Backend:
1. Agrega la propiedad `public bool Activo { get; set; } = true;` en [Product.cs](file:///d:/unicesar%202026/arquitectura/demo-arquitectura/vertical-slice/apps/backend/Domain/Product.cs).
2. Crea una nueva carpeta: `apps/backend/Features/DeactivateProduct/`.
3. Crea `DeactivateProductRequest.cs`:
   ```csharp
   using MediatR;
   namespace VerticalSlice.Api.Features.DeactivateProduct;
   public record DeactivateProductRequest(Guid Id) : IRequest<IResult>;
   ```
4. Crea `DeactivateProductHandler.cs`:
   ```csharp
   using MediatR;
   using Microsoft.EntityFrameworkCore;
   using VerticalSlice.Api.Common;
   using VerticalSlice.Api.Persistence;

   namespace VerticalSlice.Api.Features.DeactivateProduct;

   public class DeactivateProductHandler(AppDbContext db) : IRequestHandler<DeactivateProductRequest, IResult>
   {
       public async Task<IResult> Handle(DeactivateProductRequest request, CancellationToken ct)
       {
           var producto = await db.Products.FirstOrDefaultAsync(p => p.Id == request.Id, ct)
               ?? throw new NotFoundException($"Producto no encontrado.");

           producto.Activo = false;
           await db.SaveChangesAsync(ct);
           return Results.NoContent();
       }
   }
   ```
5. Crea `DeactivateProductEndpoint.cs` implementando `IEndpoint`:
   ```csharp
   using MediatR;
   using VerticalSlice.Api.Common;

   namespace VerticalSlice.Api.Features.DeactivateProduct;

   public class DeactivateProductEndpoint : IEndpoint
   {
       public void MapEndpoint(IEndpointRouteBuilder app)
       {
           app.MapPost("/api/products/{id:guid}/desactivar", async (Guid id, ISender mediator) =>
           {
               return await mediator.Send(new DeactivateProductRequest(id));
           })
           .WithTags("Productos");
       }
   }
   ```
6. Ejecuta `dotnet run` y abre Swagger: comprueba que el endpoint apareció automáticamente sin registrar nada en `Program.cs`.

---

### Taller 4: Diagnóstico y Prevención de Antipatrones

Analiza con tus compañeros los siguientes errores comunes en la adopción de VSA:

1. **The God Slice (El Slice Todopoderoso):** Un slice que intenta abarcar múltiples casos de uso en una sola carpeta (por ejemplo, meter todas las operaciones de inventario, compras y facturación en un solo handler de 1,500 líneas).  
   *Solución:* Descomponer en slices atómicos por caso de uso.
2. **Fake Vertical Slice (Capas ocultas dentro del slice):** Crear carpetas por feature, pero adentro reproducir la misma burocracia de capas (`Features/CreateProduct/Controllers/`, `Features/CreateProduct/Services/`, `Features/CreateProduct/Repositories/`).  
   *Solución:* Aceptar el diseño pragmático. Si el handler solo necesita consultar la base de datos con EF Core, hacerlo directamente.
3. **Acoplamiento Horizontal Encubierto:** Un slice importando o inyectando el Handler de otro slice para reutilizar código.  
   *Regla inviolable:* **Ningún slice debe depender directamente de otro slice.** Si dos slices necesitan compartir una lógica de negocio pura, se evalúa extraerla como función pura a una clase utilitaria o servicio de dominio compartido, nunca referenciar carpetas vecinas.

---

## 12. Banco de Preguntas de Autoevaluación y Examen

Utiliza estas preguntas para comprobar tu asimilación conceptual antes de evaluaciones parciales o defensas de proyectos:

### Pregunta 1: ¿Por qué en VSA se prefiere la duplicación de DTOs frente a la reutilización mediante un DTO compartido?
> **Respuesta:** Porque unificar DTOs entre casos de uso diferentes genera acoplamiento accidental (*coincidencia estructural* en lugar de lógica de negocio). Cuando un caso de uso requiere nuevos datos o formatos, el DTO compartido muta y fuerza a revisar o probar otros casos de uso que no tenían relación con el cambio. Duplicar DTOs cuesta unos pocos bytes de código pero compra total independencia evolutiva.

### Pregunta 2: ¿Viola Vertical Slice Architecture el Principio de Responsabilidad Única (SRP)?
> **Respuesta:** No. Al contrario, lo cumple según su definición formal: un módulo debe tener una única razón para cambiar. En VSA, todo lo que cambia conjuntamente ante un nuevo requerimiento de negocio (endpoint, validación, handler, consulta) se aloja en el mismo límite modular, respondiendo a un solo actor/caso de uso.

### Pregunta 3: ¿Qué problema resuelve el autodescubrimiento con `IEndpoint` en Minimal APIs?
> **Respuesta:** Elimina el acoplamiento a un controlador centralizado (`ProductsController`). En un controlador típico, agregar o eliminar un endpoint obliga a modificar un archivo compartido por múltiples funcionalidades. Con `IEndpoint`, cada slice registra su propia ruta de manera autónoma, permitiendo eliminar el slice borrando su carpeta sin editar código de enrutamiento.

### Pregunta 4: ¿Por qué no es necesario crear una capa `IProductRepository` sobre Entity Framework Core?
> **Respuesta:** Porque `DbContext` ya implementa el patrón Unit of Work y `DbSet<T>` implementa el patrón Repository. Crear una interfaz propia encima no agrega capacidades funcionales, rompe la componibilidad de `IQueryable` para proyecciones directas eficientes y agrega una capa de indirección que rara vez se amortiza.

### Pregunta 5: Si dos slices necesitan ejecutar la misma lógica de cálculo de precios, ¿cómo debe procederse según la "Regla de los Tres Strikes"?
> **Respuesta:** Durante los primeros dos casos (duplicación incipiente), se tolera la duplicación para no crear abstracciones prematuras antes de comprender completamente la variabilidad de los casos de uso. Si un tercer caso de uso exige exactamente la misma lógica de negocio, se justifica extraer esa función pura a un módulo compartido (`Common` o un servicio de dominio).

### Pregunta 6: ¿Por qué en este repositorio las pruebas de integración utilizan Testcontainers en lugar de mocks?
> **Respuesta:** Porque los mocks prueban supuestos de código en aislamiento, no el comportamiento del sistema real. Con Testcontainers, la prueba entra por HTTP y valida el comportamiento real contra un motor PostgreSQL auténtico, detectando fallos en constraints de base de datos, tipos de datos, migraciones y transacciones reales.

### Pregunta 7: ¿Cuál es el rol de MediatR en este proyecto y qué pasaría si se retira?
> **Respuesta:** MediatR actúa como un despachador en memoria desacoplado y proporciona el pipeline de ejecución para interceptores como `ValidationBehavior`. Si se retira, los endpoints podrían invocar directamente a los handlers inyectados por DI y la arquitectura seguiría siendo Vertical Slice.

### Pregunta 8: ¿En qué se diferencia Vertical Slice Architecture de una arquitectura de Microservicios?
> **Respuesta:** VSA es una estrategia de diseño modular **dentro de un mismo proceso de ejecución (monolito modular)**, que busca la máxima cohesión sin pagar la complejidad operativa de los microservicios (redes, latencia, serialización, fallas parciales, orquestadores). VSA suele ser el mejor paso previo a microservicios: si en el futuro un slice necesita escalar de forma independiente, ya está completamente aislado y extraerlo a su propio microservicio es trivial.

---

## 13. Glosario de Términos

- **Vertical Slice (Rebanada Vertical):** Unidad de encapsulamiento que contiene todos los elementos necesarios para cumplir un caso de uso específico, atravesando todas las capas técnicas (interfaz, lógica y datos).
- **Cohesión:** Grado en el que los elementos que forman parte de un mismo módulo pertenecen juntos y trabajan en pos de un único objetivo funcional.
- **Acoplamiento:** Medida de interdependencia entre dos o más módulos de software.
- **Shotgun Surgery (Cirugía de Escopeta):** Antipatrón donde un cambio conceptual único exige realizar múltiples modificaciones pequeñas en clases y proyectos dispersos.
- **Minimal APIs:** Paradigma introducido en .NET 6+ para declarar endpoints HTTP con sintaxis concisa y mínimo overhead, prescindiendo de los controladores tradicionales de MVC.
- **Pipeline Behavior:** Interceptor en MediatR que rodea la ejecución del handler, análogo a un middleware HTTP pero a nivel de comandos y consultas en memoria.
- **Testcontainers:** Biblioteca que gestiona instancias de dependencias externas reales (bases de datos, colas de mensajería) en contenedores Docker efímeros para pruebas automatizadas.
- **Problem Details (RFC 7807):** Estándar de la IETF para representar errores y excepciones en APIs HTTP mediante objetos JSON estructurados con propiedades uniformes (`type`, `title`, `status`, `detail`).
- **Deletability (Eliminabilidad):** Atributo de calidad del software que mide la facilidad con la que una funcionalidad obsoleta puede retirarse del código sin provocar regresiones en el resto del sistema.

---

## 14. Referencias Bibliográficas y Lecturas Recomendadas

1. **Bogard, Jimmy.** (2018). *Vertical Slice Architecture*. Ponencias y artículos en Los Techies / JimmyBogard.com.
2. **Martin, Robert C. (Uncle Bob).** (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
3. **Hunt, Andrew & Thomas, David.** (1999). *The Pragmatic Programmer: From Journeyman to Master*. Addison-Wesley.
4. **Fowler, Martin.** (2018). *Refactoring: Improving the Design of Existing Code* (2da Edición). Addison-Wesley.
5. **Brown, Simon.** (2018). *The C4 Model for Visualising Software Architecture*. Leanpub.
6. **Microsoft Learn.** (2024). *ASP.NET Core Minimal APIs documentation & Entity Framework Core Best Practices*.

---

*Desarrollado con fines educativos y de investigación aplicada para los estudiantes de la Universidad Popular del Cesar (Valledupar, Cesar, Colombia · 2026).*
