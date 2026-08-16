// Envuelve Controlleres asincronos para que cualquier error
// se reenvie automaticamente al middleware de manejo de errores.
function envolverAsync(funcionController) {
  return (peticion, respuesta, siguiente) => {
    Promise.resolve(funcionController(peticion, respuesta, siguiente)).catch(siguiente);
  };
}

module.exports = envolverAsync;
