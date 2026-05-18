// Rutas del modulo de proyectos.
// Consulta: cualquier usuario autenticado. Gestion: solo administrador.
const express = require("express");
const proyectosControlador = require("./proyectos.controller");
const envolverAsync = require("../../utils/asyncHandler");
const autenticarUsuario = require("../../middlewares/autenticacion");
const autorizarRoles = require("../../middlewares/autorizacion");
const validarCamposRequeridos = require("../../middlewares/validacion");
const ROLES = require("../../utils/roles");

const rutasProyectos = express.Router();

rutasProyectos.use(autenticarUsuario);

rutasProyectos.get("/", envolverAsync(proyectosControlador.listarProyectos));

rutasProyectos.get("/:id", envolverAsync(proyectosControlador.obtenerProyecto));

rutasProyectos.post(
  "/",
  autorizarRoles(ROLES.ADMINISTRADOR),
  validarCamposRequeridos(["nombreProyecto"]),
  envolverAsync(proyectosControlador.crearProyecto)
);

rutasProyectos.put(
  "/:id",
  autorizarRoles(ROLES.ADMINISTRADOR),
  envolverAsync(proyectosControlador.actualizarProyecto)
);

module.exports = rutasProyectos;
