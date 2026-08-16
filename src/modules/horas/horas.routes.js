// Rutas del registro de horas.
// Consulta y registro: admin y estudiante. Edicion: solo administrador.
const express = require("express");
const horasController = require("./horas.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const horasRouter = express.Router();

horasRouter.use(autenticarUsuario);

horasRouter.get("/", envolverAsync(horasController.listarRegistros));

horasRouter.post(
  "/",
  validarCamposRequeridos(["idProyecto", "cantidadHoras"]),
  envolverAsync(horasController.crearRegistro)
);

horasRouter.put(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(horasController.actualizarRegistro)
);

horasRouter.delete(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(horasController.eliminarRegistro)
);

module.exports = horasRouter;
