using MediatR;

namespace VerticalSlice.Api.Features.DeleteProduct;

public record DeleteProductRequest(Guid Id) : IRequest;
