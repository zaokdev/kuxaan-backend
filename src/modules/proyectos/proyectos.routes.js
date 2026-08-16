// Rutas del modulo de proyectos.
// Consulta: cualquier usuario autenticado. Gestion: solo administrador.
const express = require("express");
const proyectosController = require("./proyectos.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const proyectosRouter = express.Router();

proyectosRouter.use(autenticarUsuario);

proyectosRouter.get("/", envolverAsync(proyectosController.listarProyectos));

proyectosRouter.get("/:id", envolverAsync(proyectosController.obtenerProyecto));

proyectosRouter.get(
  "/:id/students",
  envolverAsync(proyectosController.estudiantesDeProyecto)
);

proyectosRouter.post(
  "/",
  autorizarRoles(ROLES.ADMINISTRADOR),
  validarCamposRequeridos(["nombreProyecto"]),
  envolverAsync(proyectosController.crearProyecto)
);

proyectosRouter.put(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(proyectosController.actualizarProyecto)
);

proyectosRouter.delete(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(proyectosController.eliminarProyecto)
);

module.exports = proyectosRouter;
