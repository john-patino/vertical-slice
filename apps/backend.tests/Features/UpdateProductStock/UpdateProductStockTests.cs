using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VerticalSlice.Api.Domain;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Tests.Features.UpdateProductStock;

public class UpdateProductStockTests(CatalogoApiFactory factory)
    : IClassFixture<CatalogoApiFactory>, IAsyncLifetime
{
    private HttpClient _cliente = null!;

    public async Task InitializeAsync()
    {
        _cliente = factory.CreateClient();
        await factory.ReiniciarCatalogoAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private async Task<Guid> DadoUnProductoConStockAsync(int stock, string sku)
    {
        using var alcance = factory.Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();

        var producto = new Product
        {
            Id = Guid.NewGuid(),
            Nombre = $"Producto {sku}",
            Sku = sku,
            Categoria = "Pruebas",
            Precio = 10000m,
            Stock = stock,
            Descripcion = string.Empty
        };

        db.Products.Add(producto);
        await db.SaveChangesAsync();
        return producto.Id;
    }

    private async Task<int> StockActualAsync(Guid id)
    {
        using var alcance = factory.Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
        return await db.Products.Where(p => p.Id == id).Select(p => p.Stock).SingleAsync();
    }

    [Fact]
    public async Task Entrada_de_inventario_suma_al_stock()
    {
        var id = await DadoUnProductoConStockAsync(12, "TST-STK-001");

        var respuesta = await _cliente.PatchAsJsonAsync($"/api/products/{id}/stock", new { ajuste = 5 });

        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);
        Assert.Equal(17, await StockActualAsync(id));
    }

    [Fact]
    public async Task Salida_de_inventario_resta_del_stock()
    {
        var id = await DadoUnProductoConStockAsync(12, "TST-STK-002");

        var respuesta = await _cliente.PatchAsJsonAsync($"/api/products/{id}/stock", new { ajuste = -4 });

        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);
        Assert.Equal(8, await StockActualAsync(id));
    }

    [Fact]
    public async Task Salida_exacta_deja_el_stock_en_cero()
    {
        var id = await DadoUnProductoConStockAsync(12, "TST-STK-003");

        var respuesta = await _cliente.PatchAsJsonAsync($"/api/products/{id}/stock", new { ajuste = -12 });

        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);
        Assert.Equal(0, await StockActualAsync(id));
    }

    [Fact]
    public async Task Salida_mayor_que_la_existencia_responde_422_y_conserva_el_stock()
    {
        var id = await DadoUnProductoConStockAsync(12, "TST-STK-004");

        var respuesta = await _cliente.PatchAsJsonAsync($"/api/products/{id}/stock", new { ajuste = -20 });

        Assert.Equal(HttpStatusCode.UnprocessableEntity, respuesta.StatusCode);
        Assert.Equal(12, await StockActualAsync(id));
    }

    [Fact]
    public async Task Ajuste_cero_responde_400()
    {
        var id = await DadoUnProductoConStockAsync(12, "TST-STK-005");

        var respuesta = await _cliente.PatchAsJsonAsync($"/api/products/{id}/stock", new { ajuste = 0 });

        Assert.Equal(HttpStatusCode.BadRequest, respuesta.StatusCode);
        Assert.Equal(12, await StockActualAsync(id));
    }

    [Fact]
    public async Task Producto_inexistente_responde_404()
    {
        var respuesta = await _cliente.PatchAsJsonAsync(
            $"/api/products/{Guid.NewGuid()}/stock", new { ajuste = 5 });

        Assert.Equal(HttpStatusCode.NotFound, respuesta.StatusCode);
    }
}
