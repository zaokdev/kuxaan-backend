// Enrutador principal: agrupa todos los modulos bajo el prefijo /api.
const express = require("express");

const authRouter = require("../modules/auth/auth.routes");
const estudiantesRouter = require("../modules/estudiantes/estudiantes.routes");
const proyectosRouter = require("../modules/proyectos/proyectos.routes");
const asignacionesRouter = require("../modules/asignaciones/asignaciones.routes");
const horasRouter = require("../modules/horas/horas.routes");
const evidenciasRouter = require("../modules/evidencias/evidencias.routes");
const reportesRouter = require("../modules/reportes/reportes.routes");
const dashboardRouter = require("../modules/dashboard/dashboard.routes");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/students", estudiantesRouter);
mainRouter.use("/projects", proyectosRouter);
mainRouter.use("/assignments", asignacionesRouter);
mainRouter.use("/hours", horasRouter);
mainRouter.use("/evidence", evidenciasRouter);
mainRouter.use("/reports", reportesRouter);
mainRouter.use("/dashboard", dashboardRouter);

module.exports = mainRouter;
