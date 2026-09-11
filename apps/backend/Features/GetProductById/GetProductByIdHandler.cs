using MediatR;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Common;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Features.GetProductById;

public class GetProductByIdHandler(AppDbContext db)
    : IRequestHandler<GetProductByIdRequest, GetProductByIdResponse>
{
    public async Task<GetProductByIdResponse> Handle(
        GetProductByIdRequest request,
        CancellationToken cancellationToken)
    {
        var producto = await db.Products
            .AsNoTracking()
            .Where(p => p.Id == request.Id)
            .Select(p => new GetProductByIdResponse(
                p.Id, p.Nombre, p.Sku, p.Categoria, p.Precio, p.Stock, p.Descripcion))
            .FirstOrDefaultAsync(cancellationToken);

        return producto ?? throw new NotFoundException($"No existe un producto con Id {request.Id}.");
    }
}
