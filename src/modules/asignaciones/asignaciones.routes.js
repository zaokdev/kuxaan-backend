// Rutas del modulo de asignaciones. Solo el administrador las gestiona.
const express = require("express");
const asignacionesController = require("./asignaciones.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const asignacionesRouter = express.Router();

asignacionesRouter.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

asignacionesRouter.get("/", envolverAsync(asignacionesController.listarAsignaciones));

asignacionesRouter.post(
  "/",
  validarCamposRequeridos(["idAlumno", "idProyecto"]),
  envolverAsync(asignacionesController.crearAsignacion)
);

asignacionesRouter.delete("/:id", envolverAsync(asignacionesController.eliminarAsignacion));

module.exports = asignacionesRouter;
