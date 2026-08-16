// Rutas del modulo de evidencias.
// Consulta y carga: admin y estudiante autenticados.
const express = require("express");
const evidenciasController = require("./evidencias.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const cargarEvidencia = require("../../middlewares/cargaArchivos");
const ROLES = require("../../utils/roles");

const evidenciasRouter = express.Router();

evidenciasRouter.use(autenticarUsuario);

evidenciasRouter.get("/", envolverAsync(evidenciasController.listarEvidencias));

evidenciasRouter.get("/:id", envolverAsync(evidenciasController.obtenerEvidencia));

// Descarga del archivo fisico. El service valida que el estudiante
// solo pueda abrir sus propias evidencias.
evidenciasRouter.get("/:id/file", envolverAsync(evidenciasController.descargarEvidencia));

evidenciasRouter.post(
  "/",
  cargarEvidencia,
  validarCamposRequeridos(["idProyecto"]),
  envolverAsync(evidenciasController.crearEvidencia)
);

evidenciasRouter.delete(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(evidenciasController.eliminarEvidencia)
);

module.exports = evidenciasRouter;
