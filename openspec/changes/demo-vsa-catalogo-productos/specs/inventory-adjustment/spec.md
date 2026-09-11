## ADDED Requirements

### Requirement: Ajuste de existencias
El sistema SHALL exponer `PATCH /api/products/{id}/stock` que modifica la cantidad en existencia de un producto y devuelve el stock resultante.

La petición MUST aceptar un campo `ajuste` con un entero que puede ser positivo (entrada de inventario) o negativo (salida de inventario), de modo que la operación exprese un movimiento y no un valor absoluto.

#### Scenario: Entrada de inventario
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con `ajuste` igual a `5` sobre un producto con Stock `12`
- **THEN** el sistema persiste Stock `17` y responde `200 OK` con el stock anterior y el nuevo

#### Scenario: Salida de inventario
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con `ajuste` igual a `-4` sobre un producto con Stock `12`
- **THEN** el sistema persiste Stock `8` y responde `200 OK`

#### Scenario: Producto inexistente
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con un identificador que no existe
- **THEN** el sistema responde `404 Not Found` y no registra ningún movimiento

### Requirement: Stock no negativo
El sistema SHALL rechazar cualquier ajuste que dejaría el stock del producto por debajo de cero, preservando el valor previo.

Esta regla MUST vivir dentro del slice `UpdateProductStock` y no en una capa de dominio compartida, porque es la única operación que la necesita.

#### Scenario: Salida mayor que la existencia
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con `ajuste` igual a `-20` sobre un producto con Stock `12`
- **THEN** el sistema responde `422 Unprocessable Entity` indicando el stock disponible y conserva Stock `12`

#### Scenario: Salida exacta hasta cero
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con `ajuste` igual a `-12` sobre un producto con Stock `12`
- **THEN** el sistema persiste Stock `0` y responde `200 OK`

#### Scenario: Ajuste nulo
- **WHEN** un cliente envía `PATCH /api/products/{id}/stock` con `ajuste` igual a `0`
- **THEN** el sistema responde `400 Bad Request` indicando que el ajuste debe ser distinto de cero
