using MediatR;
using VerticalSlice.Api.Common;

namespace VerticalSlice.Api.Features.DeleteProduct;

public class DeleteProductEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapDelete("/api/products/{id}", async (
                string id,
                ISender sender,
                CancellationToken ct) =>
            {
                if (!Guid.TryParse(id, out var identificador))
                {
                    return Results.Problem(
                        title: "Identificador inválido",
                        detail: $"'{id}' no es un identificador válido.",
                        statusCode: StatusCodes.Status400BadRequest);
                }

                await sender.Send(new DeleteProductRequest(identificador), ct);
                return Results.NoContent();
            })
            .WithName("DeleteProduct")
            .WithTags("Productos");
}
