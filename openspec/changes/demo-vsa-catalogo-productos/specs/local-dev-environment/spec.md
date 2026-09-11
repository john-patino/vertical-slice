## ADDED Requirements

### Requirement: Orquestación con un solo comando
El repositorio SHALL incluir un `docker-compose.yml` que levante PostgreSQL 16 en el puerto 5432, la API .NET 8 en el puerto 5000 y el servidor de desarrollo de Vite en el puerto 5173.

Ejecutar `docker-compose up` MUST ser suficiente para obtener la aplicación funcionando, sin instalar el SDK de .NET ni Node.js en la máquina anfitriona.

#### Scenario: Arranque desde cero
- **WHEN** una persona clona el repositorio y ejecuta `docker-compose up` con Docker Desktop en marcha
- **THEN** los tres servicios quedan disponibles y `http://localhost:5173` muestra el catálogo con 10 productos

#### Scenario: Orden de arranque
- **WHEN** los servicios inician simultáneamente
- **THEN** la API espera a que PostgreSQL supere su verificación de estado antes de aplicar migraciones, en lugar de fallar por conexión rechazada

#### Scenario: Persistencia entre reinicios
- **WHEN** una persona detiene los servicios con `docker-compose down` sin la bandera de volúmenes y vuelve a levantarlos
- **THEN** los datos del catálogo se conservan mediante un volumen con nombre

#### Scenario: Reinicio limpio
- **WHEN** una persona elimina los volúmenes con `docker-compose down -v` y luego ejecuta `docker-compose up`
- **THEN** la base se recrea y la carga inicial vuelve a insertar los 10 productos de muestra

### Requirement: Migraciones automáticas al iniciar
La API SHALL aplicar las migraciones pendientes de EF Core durante el arranque, antes de atender peticiones.

#### Scenario: Esquema ausente
- **WHEN** la API arranca contra una base de datos sin tablas
- **THEN** aplica todas las migraciones y crea el esquema del catálogo antes de aceptar tráfico

#### Scenario: Esquema al día
- **WHEN** la API arranca contra una base de datos ya migrada
- **THEN** no realiza cambios de esquema y continúa el arranque con normalidad

### Requirement: Carga inicial de diez productos
El sistema SHALL poblar la base con exactamente 10 productos de muestra únicamente cuando la tabla de productos esté vacía.

Cada producto de muestra MUST tener Nombre, SKU único, Categoría, Precio, Stock y Descripción. El conjunto MUST abarcar al menos tres categorías distintas para que el filtro del catálogo sea demostrable, y al menos un producto MUST tener Stock menor que 5 para ejercitar el distintivo de stock bajo.

#### Scenario: Base vacía
- **WHEN** la API arranca y la tabla de productos no tiene registros
- **THEN** inserta los 10 productos de muestra

#### Scenario: Base con datos
- **WHEN** la API arranca y la tabla de productos ya contiene registros
- **THEN** no inserta ni modifica nada, preservando los datos existentes

#### Scenario: Arranques repetidos
- **WHEN** la API se reinicia varias veces contra la misma base sembrada
- **THEN** el catálogo conserva exactamente los mismos productos, sin duplicados

### Requirement: Configuración por variables de entorno
La cadena de conexión a PostgreSQL y la URL base de la API consumida por el frontend SHALL provenir de variables de entorno declaradas en `docker-compose.yml`, con un archivo `.env.example` versionado que documente cada una.

Ningún archivo versionado SHALL contener credenciales reales.

#### Scenario: Revisión del repositorio
- **WHEN** una persona inspecciona los archivos versionados en busca de credenciales
- **THEN** encuentra únicamente valores de ejemplo destinados a desarrollo local, documentados en `.env.example`

### Requirement: Documentación de ejecución
El repositorio SHALL incluir un `README.md` que explique cómo levantar el entorno, cómo probar cada endpoint y cómo leer el código slice por slice.

El README MUST declarar explícitamente qué se dejó fuera de alcance y por qué, de modo que las ausencias se lean como decisiones arquitectónicas y no como trabajo pendiente.

#### Scenario: Primera ejecución guiada
- **WHEN** una persona sigue el README paso a paso sin conocimiento previo del proyecto
- **THEN** logra levantar la aplicación y ejecutar los cinco casos de uso sin consultar otra fuente

#### Scenario: Recorrido pedagógico
- **WHEN** un estudiante busca entender la organización del código
- **THEN** el README señala qué carpeta leer para cada caso de uso y explica por qué no existe una capa de repositorios
