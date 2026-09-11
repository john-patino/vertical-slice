namespace VerticalSlice.Api.Domain;

/// <summary>
/// Entidad persistida del catálogo.
///
/// Deliberadamente anémica: no contiene reglas de negocio. En Vertical Slice
/// Architecture las reglas viven en el slice que las necesita, no en una entidad
/// compartida que todos los casos de uso tendrían que conocer.
///
/// Esta es la única clase que todos los slices comparten, porque un solo esquema
/// de base de datos exige una sola entidad. La regla del proyecto es clara:
/// UNA entidad, MUCHOS DTOs.
/// </summary>
public class Product
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public string Descripcion { get; set; } = string.Empty;
}
