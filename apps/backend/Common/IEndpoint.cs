namespace VerticalSlice.Api.Common;

/// <summary>
/// Interfaz de marcado que cada slice implementa para registrar su propia ruta.
///
/// Es lo que sostiene la regla de eliminabilidad del proyecto: borrar la carpeta
/// de un slice retira su endpoint automáticamente, porque nadie más lo menciona.
/// Un controlador compartido con cinco acciones habría roto esa propiedad.
/// </summary>
public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
