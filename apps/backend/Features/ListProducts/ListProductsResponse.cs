namespace VerticalSlice.Api.Features.ListProducts;

/// <summary>
/// Respuesta del listado.
///
/// Tiene hoy los mismos campos que GetProductByIdResponse y aun así NO se
/// extraen a un tipo compartido: eso acoplaría dos casos de uso que no tienen
/// relación entre sí. Duplicar la forma de los datos es barato; acoplar casos
/// de uso es caro.
/// </summary>
public record ListProductsResponse(
    Guid Id,
    string Nombre,
    string Sku,
    string Categoria,
    decimal Precio,
    int Stock,
    string Descripcion);
