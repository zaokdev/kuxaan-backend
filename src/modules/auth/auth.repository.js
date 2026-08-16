// Acceso a datos para la autenticacion.
const clientePrisma = require("../../config/prisma");

function buscarUsuarioPorEmail(email) {
  return clientePrisma.usuario.findUnique({
    where: { email },
    include: { alumno: true },
  });
}

function buscarUsuarioPorId(idUsuario) {
  return clientePrisma.usuario.findUnique({ where: { idUsuario } });
}

function crearUsuario(email, passwordEncriptada, rol) {
  return clientePrisma.usuario.create({
    data: { email, password: passwordEncriptada, rol },
    select: { idUsuario: true, email: true, rol: true },
  });
}

function actualizarPassword(idUsuario, passwordEncriptada) {
  return clientePrisma.usuario.update({
    where: { idUsuario },
    data: { password: passwordEncriptada },
    select: { idUsuario: true, email: true, rol: true },
  });
}

module.exports = {
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  crearUsuario,
  actualizarPassword,
};
