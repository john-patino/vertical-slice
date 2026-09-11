using MediatR;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Common;
using VerticalSlice.Api.Domain;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Features.CreateProduct;

public class CreateProductHandler(AppDbContext db)
    : IRequestHandler<CreateProductRequest, CreateProductResponse>
{
    public async Task<CreateProductResponse> Handle(
        CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var skuOcupado = await db.Products
            .AnyAsync(p => p.Sku == request.Sku, cancellationToken);

        if (skuOcupado)
        {
            throw new ConflictException($"Ya existe un producto con el SKU {request.Sku}.");
        }

        var producto = new Product
        {
            Id = Guid.NewGuid(),
            Nombre = request.Nombre,
            Sku = request.Sku,
            Categoria = request.Categoria,
            Precio = request.Precio,
            Stock = request.Stock,
            Descripcion = request.Descripcion ?? string.Empty
        };

        db.Products.Add(producto);
        await db.SaveChangesAsync(cancellationToken);

        return new CreateProductResponse(producto.Id, producto.Nombre, producto.Sku);
    }
}
