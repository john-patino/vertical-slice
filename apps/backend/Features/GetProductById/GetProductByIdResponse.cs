namespace VerticalSlice.Api.Features.GetProductById;

/// <summary>
/// Respuesta del detalle. Coincide campo por campo con ListProductsResponse y
/// aun así vive aparte: el día que el detalle necesite mostrar historial de
/// movimientos, este tipo evoluciona sin que el listado se entere.
///
/// Ejercicio de clase: agrega aquí un campo y comprueba que ningún otro slice
/// necesita recompilarse conceptualmente ni cambiar su contrato.
/// </summary>
public record GetProductByIdResponse(
    Guid Id,
    string Nombre,
    string Sku,
    string Categoria,
    decimal Precio,
    int Stock,
    string Descripcion);
