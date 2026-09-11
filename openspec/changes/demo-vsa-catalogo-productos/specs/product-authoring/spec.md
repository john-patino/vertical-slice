## ADDED Requirements

### Requirement: Creación de producto
El sistema SHALL exponer `POST /api/products` que da de alta un producto en el catálogo y devuelve `201 Created` con la cabecera `Location` apuntando al recurso creado.

El slice `CreateProduct` MUST contener su propio `CreateProductRequest`, `CreateProductResponse`, `CreateProductValidator` y `CreateProductHandler` en una única carpeta.

#### Scenario: Alta válida
- **WHEN** un cliente envía `POST /api/products` con Nombre, SKU, Categoría, Precio y Stock válidos
- **THEN** el sistema persiste el producto, responde `201 Created` con el Id asignado y la cabecera `Location` con la ruta `GET /api/products/{id}`

#### Scenario: SKU duplicado
- **WHEN** un cliente envía `POST /api/products` con un SKU que ya existe en el catálogo
- **THEN** el sistema responde `409 Conflict` y no crea ningún registro

#### Scenario: Descripción opcional
- **WHEN** un cliente envía `POST /api/products` sin campo Descripción
- **THEN** el sistema crea el producto con Descripción vacía y responde `201 Created`

### Requirement: Validación de la petición de alta
El validador del slice `CreateProduct` SHALL rechazar peticiones inválidas antes de que el handler acceda a la base de datos, devolviendo `400 Bad Request` con un cuerpo de errores por campo.

Las reglas MUST ser: Nombre obligatorio de 3 a 120 caracteres; SKU obligatorio de 3 a 40 caracteres alfanuméricos y guiones; Categoría obligatoria de hasta 60 caracteres; Precio mayor que cero; Stock entero mayor o igual que cero; Descripción de hasta 500 caracteres.

#### Scenario: Precio no positivo
- **WHEN** un cliente envía `POST /api/products` con Precio igual a `0` o negativo
- **THEN** el sistema responde `400 Bad Request` con un error asociado al campo `precio` y no consulta la base de datos

#### Scenario: Stock negativo
- **WHEN** un cliente envía `POST /api/products` con Stock negativo
- **THEN** el sistema responde `400 Bad Request` con un error asociado al campo `stock`

#### Scenario: Múltiples campos inválidos
- **WHEN** un cliente envía `POST /api/products` con Nombre vacío y Precio negativo
- **THEN** el sistema responde `400 Bad Request` enumerando ambos errores en una sola respuesta

### Requirement: Eliminación de producto
El sistema SHALL exponer `DELETE /api/products/{id}` que retira un producto del catálogo de forma definitiva.

El slice `DeleteProduct` MUST resolver la eliminación con su propio handler, sin compartir código con `CreateProduct`.

#### Scenario: Eliminación exitosa
- **WHEN** un cliente envía `DELETE /api/products/{id}` con un identificador existente
- **THEN** el sistema elimina el registro y responde `204 No Content`

#### Scenario: Eliminación de producto inexistente
- **WHEN** un cliente envía `DELETE /api/products/{id}` con un identificador que no existe
- **THEN** el sistema responde `404 Not Found` y no altera el catálogo

#### Scenario: Consulta posterior a la eliminación
- **WHEN** un cliente elimina un producto y luego solicita `GET /api/products/{id}` con el mismo identificador
- **THEN** el sistema responde `404 Not Found`

### Requirement: Ausencia de repositorio genérico
Ningún slice de alta o baja SHALL depender de una interfaz de repositorio, de un servicio de dominio compartido ni de un patrón Unit of Work. Los handlers MUST usar `AppDbContext` directamente.

#### Scenario: Revisión de dependencias del handler
- **WHEN** un estudiante inspecciona el constructor de `CreateProductHandler`
- **THEN** encuentra únicamente `AppDbContext` como dependencia de acceso a datos, sin abstracciones intermedias
