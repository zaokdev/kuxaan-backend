// Configuracion de la aplicacion Express.
const express = require("express");
const cors = require("cors");

const enrutadorPrincipal = require("./routes");
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/manejoErrores");

const aplicacion = express();

aplicacion.use(cors());
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// Verificacion rapida de estado del servidor.
aplicacion.get("/", (peticion, respuesta) => {
  respuesta.json({ mensaje: "API KUXAAN en funcionamiento" });
});

aplicacion.use("/api", enrutadorPrincipal);

// Middlewares finales: ruta no encontrada y manejo de errores.
aplicacion.use(rutaNoEncontrada);
aplicacion.use(manejarErrores);

module.exports = aplicacion;
