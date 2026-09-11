namespace VerticalSlice.Api.Features.UpdateProductStock;

public record UpdateProductStockResponse(
    Guid Id,
    string Nombre,
    int StockAnterior,
    int StockNuevo);
