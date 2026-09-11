namespace VerticalSlice.Api.Features.CreateProduct;

/// <summary>Solo devuelve lo que el cliente necesita para navegar al recurso creado.</summary>
public record CreateProductResponse(Guid Id, string Nombre, string Sku);
