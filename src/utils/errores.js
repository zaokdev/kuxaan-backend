// Error de aplicacion con codigo HTTP, usado en services y controllers
// para diferenciar fallos esperados (404, 400, 401) de errores internos.
class ErrorAplicacion extends Error {
  constructor(mensaje, codigoEstado = 400) {
    super(mensaje);
    this.codigoEstado = codigoEstado;
    this.esErrorControlado = true;
  }
}

module.exports = ErrorAplicacion;
