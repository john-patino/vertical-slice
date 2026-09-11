using System.Reflection;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using VerticalSlice.Api.Common;
using VerticalSlice.Api.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opciones =>
    opciones.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// MediatR y FluentValidation escanean este ensamblado: cada slice aporta su
// handler y su validador sin que haya que registrarlos uno por uno.
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
builder.Services.AddTransient(typeof(MediatR.IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

builder.Services.AddExceptionHandler<ExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// El frontend se sirve desde otro origen durante el desarrollo.
builder.Services.AddCors(opciones => opciones.AddDefaultPolicy(politica =>
    politica.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

await MigrarYSembrarAsync(app);

app.UseExceptionHandler();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/health", () => Results.Ok(new { estado = "ok" }));

// Cada slice registra su propia ruta. Esto es todo el "enrutamiento" del proyecto.
MapearEndpointsDeLosSlices(app);

app.Run();

// Descubre las implementaciones de IEndpoint y deja que cada una se registre.
// Borrar la carpeta de un slice retira su ruta sin editar este archivo.
static void MapearEndpointsDeLosSlices(WebApplication app)
{
    var endpoints = Assembly.GetExecutingAssembly().GetTypes()
        .Where(t => typeof(IEndpoint).IsAssignableFrom(t) && t is { IsInterface: false, IsAbstract: false })
        .Select(Activator.CreateInstance)
        .Cast<IEndpoint>();

    foreach (var endpoint in endpoints)
    {
        endpoint.MapEndpoint(app);
    }
}

// Migraciones y carga inicial antes de atender la primera petición.
static async Task MigrarYSembrarAsync(WebApplication app)
{
    using var alcance = app.Services.CreateScope();
    var db = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(db);
}

// Necesario para que las pruebas de integración puedan referenciar Program.
public partial class Program;
