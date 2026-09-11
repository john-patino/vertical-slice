using MediatR;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Common;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Features.UpdateProductStock;

public class UpdateProductStockHandler(AppDbContext db)
    : IRequestHandler<UpdateProductStockRequest, UpdateProductStockResponse>
{
    public async Task<UpdateProductStockResponse> Handle(
        UpdateProductStockRequest request,
        CancellationToken cancellationToken)
    {
        var producto = await db.Products
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"No existe un producto con Id {request.Id}.");

        var stockAnterior = producto.Stock;
        var stockNuevo = stockAnterior + request.Ajuste;

        // La regla de stock no negativo vive AQUÍ, no en Domain/Product.cs:
        // es la única operación del sistema que puede violarla. Subirla al
        // dominio la haría visible para cuatro slices a los que no les concierne.
        if (stockNuevo < 0)
        {
            throw new BusinessRuleException(
                $"El ajuste dejaría el stock en {stockNuevo}. Disponible actualmente: {stockAnterior}.");
        }

        producto.Stock = stockNuevo;
        await db.SaveChangesAsync(cancellationToken);

        return new UpdateProductStockResponse(producto.Id, producto.Nombre, stockAnterior, stockNuevo);
    }
}
