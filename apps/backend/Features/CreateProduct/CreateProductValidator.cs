using FluentValidation;

namespace VerticalSlice.Api.Features.CreateProduct;

/// <summary>
/// Reglas de entrada de ESTE caso de uso. Viven aquí y no en una capa de
/// validación compartida: si mañana el alta admite productos sin precio, solo
/// cambia este archivo.
/// </summary>
public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .Length(3, 120).WithMessage("El nombre debe tener entre 3 y 120 caracteres.");

        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("El SKU es obligatorio.")
            .Length(3, 40).WithMessage("El SKU debe tener entre 3 y 40 caracteres.")
            .Matches("^[a-zA-Z0-9-]+$").WithMessage("El SKU solo admite letras, números y guiones.");

        RuleFor(x => x.Categoria)
            .NotEmpty().WithMessage("La categoría es obligatoria.")
            .MaximumLength(60).WithMessage("La categoría admite hasta 60 caracteres.");

        RuleFor(x => x.Precio)
            .GreaterThan(0).WithMessage("El precio debe ser mayor que cero.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("El stock no puede ser negativo.");

        RuleFor(x => x.Descripcion)
            .MaximumLength(500).WithMessage("La descripción admite hasta 500 caracteres.");
    }
}
