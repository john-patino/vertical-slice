using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Tests.Features.CreateProduct;

/// <summary>
/// Pruebas del slice CreateProduct, organizadas igual que el código de producción:
/// una carpeta por slice, no una carpeta por tipo de prueba.
/// </summary>
public class CreateProductTests(CatalogoApiFactory factory) : IClassFixture<CatalogoApiFactory>, IAsyncLifetime
{
    private HttpClient _cliente = null!;

    public async Task InitializeAsync()
    {
        _cliente = factory.CreateClient();
        await factory.ReiniciarCatalogoAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Alta_valida_responde_201_y_persiste_el_producto()
    {
        var respuesta = await _cliente.PostAsJsonAsync("/api/products", new
        {
            nombre = "Teclado de prueba",
            sku = "TST-TEC-001",
            categoria = "Periféricos",
            precio = 189900m,
            stock = 12,
            descripcion = "Creado por una prueba de integración."
        });

        Assert.Equal(HttpStatusCode.Created, respuesta.StatusCode);
        Assert.NotNull(respuesta.Headers.Location);

        // Se verifica contra la base, no contra un doble: el producto existe de verdad.
        using var alcance = factory.Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
        var persistido = await db.Products.SingleAsync(p => p.Sku == "TST-TEC-001");

        Assert.Equal("Teclado de prueba", persistido.Nombre);
        Assert.Equal(189900m, persistido.Precio);
        Assert.Equal(12, persistido.Stock);
    }

    [Fact]
    public async Task Sku_duplicado_responde_409_y_no_crea_un_segundo_registro()
    {
        var cuerpo = new
        {
            nombre = "Mouse de prueba",
            sku = "TST-MOU-002",
            categoria = "Periféricos",
            precio = 94500m,
            stock = 5,
            descripcion = ""
        };

        var primera = await _cliente.PostAsJsonAsync("/api/products", cuerpo);
        Assert.Equal(HttpStatusCode.Created, primera.StatusCode);

        var segunda = await _cliente.PostAsJsonAsync("/api/products", cuerpo);
        Assert.Equal(HttpStatusCode.Conflict, segunda.StatusCode);

        using var alcance = factory.Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.Equal(1, await db.Products.CountAsync(p => p.Sku == "TST-MOU-002"));
    }

    [Fact]
    public async Task Precio_no_positivo_responde_400_sin_tocar_la_base()
    {
        var respuesta = await _cliente.PostAsJsonAsync("/api/products", new
        {
            nombre = "Producto inválido",
            sku = "TST-INV-003",
            categoria = "Periféricos",
            precio = 0m,
            stock = 1,
            descripcion = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);

        using var alcance = factory.Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.False(await db.Products.AnyAsync(p => p.Sku == "TST-INV-003"));
    }

    [Fact]
    public async Task Varios_campos_invalidos_se_reportan_en_una_sola_respuesta()
    {
        var respuesta = await _cliente.PostAsJsonAsync("/api/products", new
        {
            nombre = "",
            sku = "TST-INV-004",
            categoria = "Periféricos",
            precio = -5m,
            stock = -3,
            descripcion = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);

        var problema = await respuesta.Content.ReadFromJsonAsync<RespuestaValidacion>();
        Assert.NotNull(problema);
        Assert.Contains("nombre", problema!.Errors.Keys);
        Assert.Contains("precio", problema.Errors.Keys);
        Assert.Contains("stock", problema.Errors.Keys);
    }

    private record RespuestaValidacion(Dictionary<string, string[]> Errors);
}
