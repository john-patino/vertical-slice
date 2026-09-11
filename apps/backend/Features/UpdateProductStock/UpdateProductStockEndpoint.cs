using MediatR;
using VerticalSlice.Api.Common;

namespace VerticalSlice.Api.Features.UpdateProductStock;

public class UpdateProductStockEndpoint : IEndpoint
{
    public record Cuerpo(int Ajuste);

    public void MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapPatch("/api/products/{id}/stock", async (
                string id,
                Cuerpo cuerpo,
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

                var resultado = await sender.Send(
                    new UpdateProductStockRequest(identificador, cuerpo.Ajuste), ct);

                return Results.Ok(resultado);
            })
            .WithName("UpdateProductStock")
            .WithTags("Productos");
}
