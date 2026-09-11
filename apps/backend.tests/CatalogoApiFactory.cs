using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using VerticalSlice.Api.Persistence;

namespace VerticalSlice.Api.Tests;

/// <summary>
/// Levanta la API contra un PostgreSQL REAL en un contenedor efímero.
///
/// No hay dobles de prueba en ninguna parte, y no porque se haya evitado
/// usarlos: es que no hay nada que simular. Sin IProductRepository de por medio,
/// la prueba entra por HTTP y verifica contra la base. Prueba el caso de uso,
/// no el andamiaje.
/// </summary>
public class CatalogoApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("catalogo_pruebas")
        .WithUsername("pruebas")
        .WithPassword("pruebas")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:Default", _postgres.GetConnectionString());
        builder.UseEnvironment("Testing");
    }

    public async Task InitializeAsync() => await _postgres.StartAsync();

    public new async Task DisposeAsync()
    {
        await _postgres.DisposeAsync();
        await base.DisposeAsync();
    }

    /// <summary>Deja el catálogo con solo los productos que la prueba necesita.</summary>
    public async Task ReiniciarCatalogoAsync()
    {
        using var alcance = Services.CreateScope();
        var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Products.ExecuteDeleteAsync();
    }
}
