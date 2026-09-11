## ADDED Requirements

### Requirement: Layout con menú lateral responsivo
La aplicación SHALL presentar un layout con un menú lateral que enlaza a Catálogo de Productos (inicio), Nuevo Producto y Ajuste de Inventario.

El menú MUST permanecer visible de forma fija en pantallas de 1024 px o más, y MUST colapsar tras un botón de alternancia en pantallas menores.

#### Scenario: Escritorio
- **WHEN** una persona abre la aplicación en una ventana de 1280 px de ancho
- **THEN** el menú lateral aparece expandido de forma permanente junto al contenido, sin superponerse

#### Scenario: Móvil
- **WHEN** una persona abre la aplicación en una ventana de 375 px de ancho
- **THEN** el menú permanece oculto y se muestra un botón de alternancia que lo despliega sobre el contenido

#### Scenario: Cierre tras navegar en móvil
- **WHEN** una persona con el menú desplegado en móvil selecciona un enlace de navegación
- **THEN** la aplicación navega a la vista correspondiente y el menú se cierra automáticamente

#### Scenario: Enlace activo
- **WHEN** la persona se encuentra en la vista de catálogo
- **THEN** el enlace Catálogo de Productos aparece resaltado como activo en el menú

### Requirement: Vista de catálogo
La vista de inicio SHALL mostrar los productos obtenidos de `GET /api/products` en una cuadrícula de tarjetas, presentando Nombre, SKU, Categoría, Precio y Stock de cada uno.

#### Scenario: Carga inicial
- **WHEN** una persona abre la aplicación con la base de datos recién sembrada
- **THEN** la vista muestra los 10 productos de muestra en una cuadrícula

#### Scenario: Indicador de carga
- **WHEN** la petición al catálogo está en curso
- **THEN** la vista muestra un estado de carga en lugar de una cuadrícula vacía

#### Scenario: Error de red
- **WHEN** la petición `GET /api/products` falla
- **THEN** la vista muestra un mensaje de error con una acción para reintentar

#### Scenario: Señal visual de stock bajo
- **WHEN** un producto tiene Stock menor que 5
- **THEN** su tarjeta muestra un distintivo visual de stock bajo

### Requirement: Filtro y búsqueda en tiempo real
La vista de catálogo SHALL ofrecer un selector de categoría y un campo de búsqueda que refinan la lista mostrada conforme la persona escribe, sin requerir un botón de confirmación.

El filtrado MUST ocurrir en el cliente sobre la colección ya cargada, dado que el catálogo del demo es pequeño y así la respuesta es inmediata.

#### Scenario: Búsqueda por nombre
- **WHEN** una persona escribe `tecla` en el campo de búsqueda
- **THEN** la cuadrícula se reduce inmediatamente a los productos cuyo Nombre o SKU contiene ese texto

#### Scenario: Filtro por categoría
- **WHEN** una persona selecciona la categoría `Periféricos`
- **THEN** la cuadrícula muestra solo los productos de esa categoría

#### Scenario: Filtro y búsqueda combinados
- **WHEN** una persona selecciona una categoría y además escribe un término de búsqueda
- **THEN** la cuadrícula muestra solo los productos que cumplen ambas condiciones

#### Scenario: Sin coincidencias
- **WHEN** ningún producto cumple los criterios activos
- **THEN** la vista muestra un estado vacío con una acción para limpiar los filtros

### Requirement: Detalle de producto desde la interfaz
La aplicación SHALL ofrecer un modal de detalle que se abre desde una tarjeta del catálogo y muestra todos los campos del producto, incluida la Descripción completa.

El modal MUST obtener los datos mediante su propia petición a `GET /api/products/{id}` al abrirse, sin reutilizar el objeto ya cargado por la vista de catálogo, de modo que el slice de detalle sea dueño de su acceso a datos.

#### Scenario: Apertura del detalle
- **WHEN** una persona selecciona una tarjeta del catálogo
- **THEN** la aplicación emite `GET /api/products/{id}` y muestra el modal con Nombre, SKU, Categoría, Precio, Stock y Descripción completa

#### Scenario: Carga del detalle en curso
- **WHEN** la petición de detalle está en progreso
- **THEN** el modal muestra un estado de carga en lugar de campos vacíos

#### Scenario: Producto eliminado en otra pestaña
- **WHEN** la petición de detalle responde `404 Not Found` porque el producto ya no existe
- **THEN** el modal muestra que el producto no está disponible y ofrece refrescar el catálogo

#### Scenario: Cierre del modal
- **WHEN** una persona cierra el modal con el botón de cierre o la tecla Escape
- **THEN** el modal se oculta y el catálogo permanece en el mismo estado de filtros que tenía

### Requirement: Alta de producto desde la interfaz
La aplicación SHALL ofrecer un formulario modal de Nuevo Producto que envía `POST /api/products` y refleja el resultado sin recargar la página.

#### Scenario: Alta exitosa
- **WHEN** una persona completa el formulario con datos válidos y confirma
- **THEN** la aplicación crea el producto, cierra el modal, muestra una confirmación y el nuevo producto aparece en el catálogo

#### Scenario: Errores de validación del servidor
- **WHEN** la API responde `400 Bad Request` con errores por campo
- **THEN** el formulario permanece abierto y muestra cada mensaje junto a su campo correspondiente, conservando lo ya escrito

#### Scenario: SKU duplicado
- **WHEN** la API responde `409 Conflict` por SKU repetido
- **THEN** el formulario muestra el conflicto junto al campo SKU

#### Scenario: Envío en curso
- **WHEN** el envío del formulario está en progreso
- **THEN** el botón de confirmación queda deshabilitado para impedir un alta duplicada

### Requirement: Ajuste de stock desde la interfaz
La aplicación SHALL ofrecer una vista de Ajuste de Inventario que permite seleccionar un producto y aplicar un ajuste positivo o negativo mediante `PATCH /api/products/{id}/stock`.

#### Scenario: Ajuste exitoso
- **WHEN** una persona selecciona un producto, indica un ajuste válido y confirma
- **THEN** la aplicación aplica el cambio y muestra el stock resultante

#### Scenario: Stock insuficiente
- **WHEN** la API responde `422 Unprocessable Entity` porque el ajuste dejaría el stock negativo
- **THEN** la vista muestra el motivo y el stock disponible, sin alterar el valor mostrado

### Requirement: Correspondencia visible entre frontend y slices
El código del frontend SHALL organizarse en `src/features/<slice>/` con nombres que coincidan con los slices del backend, de modo que la correspondencia uno a uno sea evidente al navegar el árbol de carpetas.

Los cinco slices del backend MUST tener cada uno una carpeta correspondiente en el frontend y al menos un consumidor real en la interfaz. Ningún endpoint SHALL quedar sin ejercitar desde la aplicación.

#### Scenario: Recorrido del árbol de carpetas
- **WHEN** un estudiante compara `apps/backend/Features/` con `apps/frontend/src/features/`
- **THEN** encuentra cinco carpetas de nombre equivalente, una por caso de uso, sin excepciones ni asimetrías que requieran explicación

#### Scenario: Cobertura de los cinco endpoints
- **WHEN** se registra el tráfico de red mientras una persona recorre el catálogo, abre un detalle, crea un producto, ajusta stock y elimina un producto
- **THEN** se observan peticiones a los cinco endpoints de la API, sin que ninguno quede sin invocar
