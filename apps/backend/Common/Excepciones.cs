namespace VerticalSlice.Api.Common;

/// <summary>El recurso solicitado no existe. Se traduce a 404.</summary>
public class NotFoundException(string mensaje) : Exception(mensaje);

/// <summary>El estado actual impide la operación. Se traduce a 409.</summary>
public class ConflictException(string mensaje) : Exception(mensaje);

/// <summary>
/// La petición es sintácticamente válida pero viola una regla de negocio.
/// Se traduce a 422.
/// </summary>
public class BusinessRuleException(string mensaje) : Exception(mensaje);
