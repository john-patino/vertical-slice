using MediatR;
using VerticalSlice.Api.Common;

namespace VerticalSlice.Api.Features.CreateProduct;

public class CreateProductEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapPost("/api/products", async (
                CreateProductRequest request,
                ISender sender,
                CancellationToken ct) =>
            {
                var creado = await sender.Send(request, ct);
                return Results.Created($"/api/products/{creado.Id}", creado);
            })
            .WithName("CreateProduct")
            .WithTags("Productos");
}
