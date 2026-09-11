using FluentValidation;

namespace VerticalSlice.Api.Features.UpdateProductStock;

public class UpdateProductStockValidator : AbstractValidator<UpdateProductStockRequest>
{
    public UpdateProductStockValidator()
    {
        RuleFor(x => x.Ajuste)
            .NotEqual(0).WithMessage("El ajuste debe ser distinto de cero.");
    }
}
