using MediatR;
using VerticalSlice.Api.Common;

namespace VerticalSlice.Api.Features.ListProducts;

public class ListProductsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/api/products", async (
                string? categoria,
                string? buscar,
                ISender sender,
                CancellationToken ct) =>
            Results.Ok(await sender.Send(new ListProductsRequest(categoria, buscar), ct)))
            .WithName("ListProducts")
            .WithTags("Productos");
}
