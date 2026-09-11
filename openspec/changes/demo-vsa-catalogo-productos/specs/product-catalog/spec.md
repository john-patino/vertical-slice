## ADDED Requirements

### Requirement: Listado de productos
El sistema SHALL exponer `GET /api/products` que devuelve todos los productos del catálogo con sus campos Id, Nombre, SKU, Categoría, Precio, Stock y Descripción.

El slice `ListProducts` MUST resolver la consulta contra `AppDbContext` dentro de su propio handler, sin delegar en un repositorio compartido, y MUST proyectar directamente al DTO de respuesta del slice.

#### Scenario: Catálogo con productos
- **WHEN** un cliente envía `GET /api/products` y la tabla contiene los 10 productos de la carga inicial
- **THEN** el sistema responde `200 OK` con un arreglo de 10 elementos, cada uno con Id, Nombre, SKU, Categoría, Precio, Stock y Descripción

#### Scenario: Catálogo vacío
- **WHEN** un cliente envía `GET /api/products` y no existe ningún producto
- **THEN** el sistema responde `200 OK` con un arreglo vacío, nunca `404`

#### Scenario: Filtro por categoría
- **WHEN** un cliente envía `GET /api/products?categoria=Periféricos`
- **THEN** el sistema responde `200 OK` únicamente con los productos cuya categoría coincide exactamente, ignorando diferencias de mayúsculas y minúsculas

#### Scenario: Búsqueda por término
- **WHEN** un cliente envía `GET /api/products?buscar=tecla`
- **THEN** el sistema responde `200 OK` con los productos cuyo Nombre o SKU contiene el término, sin distinguir mayúsculas ni acentos

### Requirement: Consulta de producto por identificador
El sistema SHALL exponer `GET /api/products/{id}` que devuelve un único producto.

El slice `GetProductById` MUST tener su propio DTO de respuesta, independiente del que usa `ListProducts`, aunque los campos coincidan. Esta duplicación es intencional: demuestra que los slices evolucionan por separado.

#### Scenario: Producto existente
- **WHEN** un cliente solicita `GET /api/products/{id}` con un identificador que existe
- **THEN** el sistema responde `200 OK` con el detalle completo del producto

#### Scenario: Producto inexistente
- **WHEN** un cliente solicita `GET /api/products/{id}` con un identificador que no existe
- **THEN** el sistema responde `404 Not Found` con un cuerpo `ProblemDetails` que indica que el producto no fue encontrado

#### Scenario: Identificador con formato inválido
- **WHEN** un cliente solicita `GET /api/products/abc` donde el identificador no es un GUID válido
- **THEN** el sistema responde `400 Bad Request` sin consultar la base de datos

### Requirement: Independencia entre slices de lectura
Cada slice de consulta MUST ser eliminable borrando únicamente su carpeta bajo `Features/`, sin que la compilación de los demás slices falle.

#### Scenario: Eliminación de un slice
- **WHEN** un docente elimina la carpeta `Features/GetProductById` completa
- **THEN** el proyecto compila y el resto de los endpoints sigue funcionando
