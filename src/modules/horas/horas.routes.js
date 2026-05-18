// Rutas del registro de horas.
// Consulta y registro: admin y estudiante. Edicion: solo administrador.
const express = require("express");
const horasControlador = require("./horas.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const rutasHoras = express.Router();

rutasHoras.use(autenticarUsuario);

rutasHoras.get("/", envolverAsync(horasControlador.listarRegistros));

rutasHoras.post(
  "/",
  validarCamposRequeridos(["idProyecto", "cantidadHoras"]),
  envolverAsync(horasControlador.crearRegistro)
);

rutasHoras.put(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(horasControlador.actualizarRegistro)
);

module.exports = rutasHoras;
