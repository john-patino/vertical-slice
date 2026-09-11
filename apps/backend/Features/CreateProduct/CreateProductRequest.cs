using MediatR;

namespace VerticalSlice.Api.Features.CreateProduct;

public record CreateProductRequest(
    string Nombre,
    string Sku,
    string Categoria,
    decimal Precio,
    int Stock,
    string? Descripcion) : IRequest<CreateProductResponse>;
