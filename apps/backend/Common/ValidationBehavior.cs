using FluentValidation;
using MediatR;

namespace VerticalSlice.Api.Common;

/// <summary>
/// Único comportamiento transversal del backend: ejecuta el validador del slice
/// antes de que su handler toque la base de datos.
///
/// Vive en Common/ porque es infraestructura, no lógica de negocio. Las REGLAS
/// viven en el slice: el validador de cada caso de uso está en su propia carpeta.
/// </summary>
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validadores)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!validadores.Any())
        {
            return await next();
        }

        var contexto = new ValidationContext<TRequest>(request);
        var resultados = await Task.WhenAll(
            validadores.Select(v => v.ValidateAsync(contexto, cancellationToken)));

        var errores = resultados.SelectMany(r => r.Errors).Where(e => e is not null).ToList();

        if (errores.Count != 0)
        {
            throw new ValidationException(errores);
        }

        return await next();
    }
}
