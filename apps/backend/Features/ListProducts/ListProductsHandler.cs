using MediatR;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Features.ListProducts;

/// <summary>
/// Consulta el catálogo directamente contra AppDbContext, sin repositorio
/// de por medio, y proyecta al DTO propio de este slice.
/// </summary>
public class ListProductsHandler(AppDbContext db)
    : IRequestHandler<ListProductsRequest, IReadOnlyList<ListProductsResponse>>
{
    public async Task<IReadOnlyList<ListProductsResponse>> Handle(
        ListProductsRequest request,
        CancellationToken cancellationToken)
    {
        var consulta = db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Categoria))
        {
            // ILIKE sin comodines: comparación exacta que ignora mayúsculas.
            consulta = consulta.Where(p => EF.Functions.ILike(p.Categoria, request.Categoria));
        }

        if (!string.IsNullOrWhiteSpace(request.Buscar))
        {
            // unaccent() permite que "peri" encuentre "Periféricos".
            var patron = $"%{request.Buscar}%";
            consulta = consulta.Where(p =>
                EF.Functions.ILike(EF.Functions.Unaccent(p.Nombre), EF.Functions.Unaccent(patron)) ||
                EF.Functions.ILike(EF.Functions.Unaccent(p.Sku), EF.Functions.Unaccent(patron)));
        }

        return await consulta
            .OrderBy(p => p.Nombre)
            .Select(p => new ListProductsResponse(
                p.Id, p.Nombre, p.Sku, p.Categoria, p.Precio, p.Stock, p.Descripcion))
            .ToListAsync(cancellationToken);
    }
}
