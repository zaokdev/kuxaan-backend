// Datos iniciales: crea un usuario administrador por defecto.
// Ejecutar con: npm run seed
const clientePrisma = require("../src/config/prisma");
const { encriptarContrasena } = require("../src/utils/contrasenas");

async function ejecutarSeed() {
  const emailAdministrador = "admin@kuxaan.com";

  const administradorExistente = await clientePrisma.usuario.findUnique({
    where: { email: emailAdministrador },
  });

  if (administradorExistente) {
    console.log("El administrador ya existe, no se crea de nuevo.");
    return;
  }

  const passwordEncriptada = await encriptarContrasena("Admin123");

  await clientePrisma.usuario.create({
    data: {
      email: emailAdministrador,
      password: passwordEncriptada,
      rol: "ADMINISTRADOR",
    },
  });

  console.log(`Administrador creado: ${emailAdministrador} / Admin123`);
}

ejecutarSeed()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await clientePrisma.$disconnect();
  });
