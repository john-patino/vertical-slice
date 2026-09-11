using MediatR;

namespace VerticalSlice.Api.Features.GetProductById;

public record GetProductByIdRequest(Guid Id) : IRequest<GetProductByIdResponse>;
