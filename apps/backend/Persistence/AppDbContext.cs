using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Domain;

namespace VerticalSlice.Api.Persistence;

/// <summary>
/// Contexto de EF Core. Los handlers de cada slice lo reciben por inyección y
/// consultan directamente: no hay repositorio genérico de por medio.
///
/// DbSet&lt;T&gt; YA ES un repositorio e IQueryable YA ES una especificación.
/// Envolverlos en IProductRepository añadiría indirección sin añadir capacidad.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Habilita unaccent(), que el slice ListProducts usa para que la búsqueda
        // encuentre "Periféricos" al escribir "periferico".
        modelBuilder.HasPostgresExtension("unaccent");

        modelBuilder.Entity<Product>(entidad =>
        {
            entidad.ToTable("productos");
            entidad.HasKey(p => p.Id);

            // Nombres en minúscula para que las consultas SQL directas no
            // necesiten comillas dobles, que es lo que PostgreSQL exige cuando
            // un identificador lleva mayúsculas.
            entidad.Property(p => p.Id).HasColumnName("id");
            entidad.Property(p => p.Nombre).HasColumnName("nombre").HasMaxLength(120).IsRequired();
            entidad.Property(p => p.Sku).HasColumnName("sku").HasMaxLength(40).IsRequired();
            entidad.Property(p => p.Categoria).HasColumnName("categoria").HasMaxLength(60).IsRequired();
            entidad.Property(p => p.Precio).HasColumnName("precio").HasPrecision(10, 2);
            entidad.Property(p => p.Stock).HasColumnName("stock").IsRequired();
            entidad.Property(p => p.Descripcion).HasColumnName("descripcion").HasMaxLength(500);

            // El SKU identifica comercialmente al producto: la base lo garantiza,
            // y el slice CreateProduct además lo comprueba para responder 409.
            entidad.HasIndex(p => p.Sku).IsUnique();
        });
    }
}
