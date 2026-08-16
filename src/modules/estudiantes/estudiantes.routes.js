// Rutas del modulo de estudiantes. Solo el administrador las gestiona.
const express = require("express");
const estudiantesController = require("./estudiantes.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const estudiantesRouter = express.Router();

// Auto-servicio del estudiante: perfil y proyecto propios.
// Van antes del guard de administrador; el service valida que sea estudiante.
estudiantesRouter.get(
  "/me",
  autenticarUsuario,
  envolverAsync(estudiantesController.obtenerMiPerfil)
);
estudiantesRouter.get(
  "/me/project",
  autenticarUsuario,
  envolverAsync(estudiantesController.obtenerMiProyecto)
);
estudiantesRouter.put(
  "/me",
  autenticarUsuario,
  envolverAsync(estudiantesController.actualizarMiPerfil)
);

// El resto de rutas requieren usuario autenticado con rol administrador.
estudiantesRouter.use(autenticarUsuario, autorizarRoles(ROLES.ADMINISTRADOR));

estudiantesRouter.get("/", envolverAsync(estudiantesController.listarEstudiantes));

estudiantesRouter.get("/:id", envolverAsync(estudiantesController.obtenerEstudiante));

estudiantesRouter.post(
  "/",
  validarCamposRequeridos(["email", "contrasena", "nombreCompleto"]),
  envolverAsync(estudiantesController.crearEstudiante)
);

estudiantesRouter.put("/:id", envolverAsync(estudiantesController.actualizarEstudiante));

estudiantesRouter.put(
  "/:id/password",
  validarCamposRequeridos(["contrasenaNueva"]),
  envolverAsync(estudiantesController.restablecerContrasena)
);

estudiantesRouter.delete("/:id", envolverAsync(estudiantesController.eliminarEstudiante));

module.exports = estudiantesRouter;
