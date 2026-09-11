using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace VerticalSlice.Api.Common;

/// <summary>
/// Traduce las excepciones de los slices a respuestas ProblemDetails.
///
/// Centralizarlo aquí evita que cada handler repita el mismo bloque try/catch,
/// y mantiene los slices enfocados en su caso de uso: lanzan una excepción con
/// significado y esta capa decide el código HTTP.
/// </summary>
public class ExceptionHandler(ILogger<ExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext contexto,
        Exception excepcion,
        CancellationToken cancellationToken)
    {
        var problema = Traducir(excepcion, contexto);

        if (problema.Status >= 500)
        {
            logger.LogError(excepcion, "Error no controlado procesando {Ruta}", contexto.Request.Path);
        }

        contexto.Response.StatusCode = problema.Status ?? StatusCodes.Status500InternalServerError;

        // Se serializa con el tipo en tiempo de ejecución: con el tipo declarado
        // ProblemDetails se perdería el diccionario "errors" de
        // ValidationProblemDetails, que es justo lo que el formulario necesita
        // para colocar cada mensaje junto a su campo.
        await contexto.Response.WriteAsJsonAsync(problema, problema.GetType(), options: null, cancellationToken);
        return true;
    }

    private static ProblemDetails Traducir(Exception excepcion, HttpContext contexto) => excepcion switch
    {
        ValidationException validacion => ConErrores(validacion, contexto),

        // Cuerpo JSON mal formado o no deserializable. Sin este caso terminaría
        // clasificado como 500, culpando al servidor de un error del cliente.
        BadHttpRequestException or System.Text.Json.JsonException => Base(
            StatusCodes.Status400BadRequest,
            "Petición mal formada",
            "El cuerpo de la petición no pudo interpretarse como JSON válido.",
            contexto),

        NotFoundException => Base(
            StatusCodes.Status404NotFound, "Recurso no encontrado", excepcion.Message, contexto),

        ConflictException => Base(
            StatusCodes.Status409Conflict, "Conflicto con el estado actual", excepcion.Message, contexto),

        BusinessRuleException => Base(
            StatusCodes.Status422UnprocessableEntity, "Regla de negocio incumplida", excepcion.Message, contexto),

        _ => Base(
            StatusCodes.Status500InternalServerError,
            "Error interno",
            "Ocurrió un error inesperado procesando la petición.",
            contexto)
    };

    /// <summary>
    /// Los errores de validación se agrupan por campo para que el formulario del
    /// frontend pueda mostrar cada mensaje junto a su control correspondiente.
    /// </summary>
    private static ValidationProblemDetails ConErrores(ValidationException excepcion, HttpContext contexto)
    {
        var errores = excepcion.Errors
            .GroupBy(e => ANombreDeCampo(e.PropertyName))
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

        return new ValidationProblemDetails(errores)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "La petición contiene campos inválidos",
            Instance = contexto.Request.Path
        };
    }

    // FluentValidation reporta "Precio"; el cliente trabaja con "precio".
    private static string ANombreDeCampo(string propiedad) =>
        string.IsNullOrEmpty(propiedad)
            ? propiedad
            : char.ToLowerInvariant(propiedad[0]) + propiedad[1..];

    private static ProblemDetails Base(int estado, string titulo, string detalle, HttpContext contexto) =>
        new()
        {
            Status = estado,
            Title = titulo,
            Detail = detalle,
            Instance = contexto.Request.Path
        };
}
