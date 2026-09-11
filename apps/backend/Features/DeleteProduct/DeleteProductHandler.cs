using MediatR;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Common;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Features.DeleteProduct;

/// <summary>
/// Este slice no tiene DTO de respuesta ni validador: devuelve 204 y su única
/// entrada es un identificador. Tiene exactamente los archivos que necesita.
/// Una plantilla uniforme habría forzado cinco.
/// </summary>
public class DeleteProductHandler(AppDbContext db) : IRequestHandler<DeleteProductRequest>
{
    public async Task Handle(DeleteProductRequest request, CancellationToken cancellationToken)
    {
        var producto = await db.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"No existe un producto con Id {request.Id}.");

        db.Products.Remove(producto);
        await db.SaveChangesAsync(cancellationToken);
    }
}
