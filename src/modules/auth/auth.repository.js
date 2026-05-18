// Acceso a datos para la autenticacion.
const clientePrisma = require("../../config/prisma");

function buscarUsuarioPorEmail(email) {
  return clientePrisma.usuario.findUnique({
    where: { email },
    include: { alumno: true },
  });
}

module.exports = { buscarUsuarioPorEmail };
