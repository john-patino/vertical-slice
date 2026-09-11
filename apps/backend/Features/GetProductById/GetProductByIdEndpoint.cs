using MediatR;
using VerticalSlice.Api.Common;

namespace VerticalSlice.Api.Features.GetProductById;

public class GetProductByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/api/products/{id}", async (string id, ISender sender, CancellationToken ct) =>
        {
            // Se parsea aquí, en lugar de usar la restricción de ruta {id:guid},
            // porque esa restricción produce 404 y el contrato pide 400: un
            // identificador mal formado es una petición inválida, no un recurso ausente.
            if (!Guid.TryParse(id, out var identificador))
            {
                return Results.Problem(
                    title: "Identificador inválido",
                    detail: $"'{id}' no es un identificador válido.",
                    statusCode: StatusCodes.Status400BadRequest);
            }

            return Results.Ok(await sender.Send(new GetProductByIdRequest(identificador), ct));
        })
        .WithName("GetProductById")
        .WithTags("Productos");
}
