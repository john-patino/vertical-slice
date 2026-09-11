using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Domain;

namespace VerticalSlice.Api.Persistence;

/// <summary>
/// Carga inicial del catálogo. Solo inserta si la tabla está vacía, de modo que
/// reiniciar la API tantas veces como haga falta nunca duplica datos.
///
/// Existe para que una demostración en vivo jamás arranque con el catálogo en blanco.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (await db.Products.AnyAsync(ct))
        {
            return;
        }

        db.Products.AddRange(Muestra());
        await db.SaveChangesAsync(ct);
    }

    /// <summary>
    /// Diez productos de muestra repartidos en cuatro categorías, para que el
    /// filtro del catálogo sea demostrable. Dos tienen Stock menor que 5 para
    /// ejercitar el distintivo de stock bajo de la interfaz.
    /// </summary>
    private static IEnumerable<Product> Muestra() =>
    [
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111101"),
            Nombre = "Teclado mecánico retroiluminado",
            Sku = "PER-TEC-001",
            Categoria = "Periféricos",
            Precio = 189_900m,
            Stock = 24,
            Descripcion = "Teclado mecánico de 87 teclas con switches azules, retroiluminación RGB y cable trenzado desmontable."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111102"),
            Nombre = "Mouse inalámbrico ergonómico",
            Sku = "PER-MOU-002",
            Categoria = "Periféricos",
            Precio = 94_500m,
            Stock = 3,
            Descripcion = "Mouse vertical de 6 botones con sensor óptico de 4000 DPI y autonomía de 70 días."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111103"),
            Nombre = "Audífonos diadema con cancelación",
            Sku = "PER-AUD-003",
            Categoria = "Periféricos",
            Precio = 312_000m,
            Stock = 11,
            Descripcion = "Audífonos over-ear con cancelación activa de ruido y 30 horas de reproducción continua."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111104"),
            Nombre = "Monitor curvo 27 pulgadas",
            Sku = "MON-CUR-004",
            Categoria = "Monitores",
            Precio = 1_249_000m,
            Stock = 7,
            Descripcion = "Panel VA curvo de 27 pulgadas, resolución QHD, 165 Hz y soporte ajustable en altura."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111105"),
            Nombre = "Monitor portátil 15.6 pulgadas",
            Sku = "MON-POR-005",
            Categoria = "Monitores",
            Precio = 789_000m,
            Stock = 2,
            Descripcion = "Segunda pantalla portátil con conexión USB-C de un solo cable y funda con soporte integrado."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111106"),
            Nombre = "Disco sólido NVMe 1 TB",
            Sku = "ALM-SSD-006",
            Categoria = "Almacenamiento",
            Precio = 428_000m,
            Stock = 40,
            Descripcion = "Unidad NVMe PCIe 4.0 con lectura secuencial de 7000 MB/s y disipador de aluminio."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111107"),
            Nombre = "Disco externo 2 TB",
            Sku = "ALM-EXT-007",
            Categoria = "Almacenamiento",
            Precio = 356_000m,
            Stock = 15,
            Descripcion = "Disco externo resistente a golpes con cifrado por hardware y conexión USB 3.2."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111108"),
            Nombre = "Memoria USB 128 GB",
            Sku = "ALM-USB-008",
            Categoria = "Almacenamiento",
            Precio = 62_000m,
            Stock = 63,
            Descripcion = "Memoria USB 3.2 con carcasa metálica giratoria y velocidad de lectura de 400 MB/s."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111109"),
            Nombre = "Silla ergonómica de malla",
            Sku = "MOB-SIL-009",
            Categoria = "Mobiliario",
            Precio = 1_090_000m,
            Stock = 9,
            Descripcion = "Silla de oficina con respaldo de malla transpirable, soporte lumbar regulable y apoyabrazos 3D."
        },
        new Product
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111110"),
            Nombre = "Escritorio elevable eléctrico",
            Sku = "MOB-ESC-010",
            Categoria = "Mobiliario",
            Precio = 2_150_000m,
            Stock = 4,
            Descripcion = "Escritorio de altura regulable por motor con cuatro posiciones memorizadas y superficie de 140 x 70 cm."
        }
    ];
}
