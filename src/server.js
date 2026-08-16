// Punto de entrada del backend: levanta el servidor HTTP.
const aplicacion = require("./app");
const configuracion = require("./config/entorno");

aplicacion.listen(configuracion.puerto, () => {
  console.log(`Servidor KUXAAN escuchando en el puerto ${configuracion.puerto}`);
});
