using System.Text.Json.Serialization;
using MediatR;

namespace VerticalSlice.Api.Features.UpdateProductStock;

/// <summary>
/// El ajuste es un MOVIMIENTO con signo, no un valor absoluto: positivo para
/// entradas de inventario, negativo para salidas. Modelarlo así evita las
/// condiciones de carrera de "escribir el stock que yo creo que hay".
/// </summary>
public record UpdateProductStockRequest(
    [property: JsonIgnore] Guid Id,
    int Ajuste) : IRequest<UpdateProductStockResponse>;
