using MediatR;

namespace VerticalSlice.Api.Features.ListProducts;

/// <summary>Filtros opcionales del catálogo. Ambos pueden venir nulos.</summary>
public record ListProductsRequest(string? Categoria, string? Buscar)
    : IRequest<IReadOnlyList<ListProductsResponse>>;
