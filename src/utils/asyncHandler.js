// Envuelve controladores asincronos para que cualquier error
// se reenvie automaticamente al middleware de manejo de errores.
function envolverAsync(funcionControlador) {
  return (peticion, respuesta, siguiente) => {
    Promise.resolve(funcionControlador(peticion, respuesta, siguiente)).catch(siguiente);
  };
}

module.exports = envolverAsync;
