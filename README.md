# Backend KUXAAN

Backend del **Sistema Digital de Gestión de Servicio Social y Proyectos Comunitarios KUXAAN**.

API REST construida con **Node.js + Express**, **Prisma ORM** sobre **MySQL** y autenticación **JWT** con control de acceso por roles (`ADMINISTRADOR`, `ESTUDIANTE`).

## Arquitectura

Arquitectura por capas (Controllers → Services → Repositories), tal como se definió en la fase de planeación:

```
src/
├── config/        Variables de entorno y cliente Prisma
├── utils/         Funciones reutilizables (respuestas, errores, jwt, hash, fechas...)
├── middlewares/   Autenticación, autorización, validación, errores, carga de archivos
├── modules/
│   ├── auth/         Inicio de sesión
│   ├── estudiantes/  Gestión de estudiantes (CRUD)
│   ├── proyectos/    Catálogo de proyectos (CRUD)
│   ├── asignaciones/ Vínculo estudiante-proyecto
│   ├── horas/        Registro de horas de servicio social
│   ├── evidencias/   Carga de archivos de evidencia
│   └── reportes/     Reportes administrativos
├── routes/        Enrutador principal
├── app.js         Configuración de Express
└── server.js      Punto de entrada
prisma/
├── schema.prisma  Esquema de las 6 tablas
├── migrations/    Migraciones versionadas
└── seed.js        Administrador inicial + datos de demostracion
```

Cada módulo separa la responsabilidad en `*.controller.js` (HTTP), `*.service.js` (lógica de negocio) y `*.repository.js` (acceso a datos). La carpeta `utils/` centraliza las funciones repetidas para evitar duplicación.

## Requisitos

- Node.js 18+
- MySQL en ejecución

## Instalación

```bash
npm install
cp .env.example .env      # configurar DATABASE_URL y JWT_SECRETO
npm run prisma:generate   # genera el cliente Prisma
npm run prisma:deploy     # aplica las migraciones a MySQL
npm run seed              # administrador + datos de demostracion
npm run dev
```

El seed crea el administrador `admin@kuxaan.com / Admin123`, tres proyectos
comunitarios y cuatro estudiantes (`Estudiante123!`) con sus asignaciones y
registros de horas, para que el sistema no se vea vacio en la primera demo.
Es idempotente: si un registro ya existe, no se duplica.

> Si `prisma:generate` falla en Windows con `EPERM`, cierra el servidor y
> cualquier proceso de Node que este usando el cliente, y vuelve a ejecutarlo.

### Base de datos que ya existia (sin historial de migraciones)

Si ya tenias las tablas creadas antes de que existiera `prisma/migrations/`,
marca la migracion inicial como aplicada y luego aplica la nueva columna:

```bash
npx prisma migrate resolve --applied 20260101000000_init
npm run prisma:deploy
```

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/register` | Administrador |
| PUT | `/api/auth/password` | Autenticado (la propia) |
| GET | `/api/students` | Administrador |
| POST | `/api/students` | Administrador |
| GET/PUT/DELETE | `/api/students/:id` | Administrador |
| PUT | `/api/students/:id/password` | Administrador |
| GET/PUT | `/api/students/me` | Estudiante |
| GET | `/api/students/me/project` | Estudiante |
| GET | `/api/projects` | Autenticado |
| GET | `/api/projects/:id` | Autenticado |
| GET | `/api/projects/:id/students` | Autenticado |
| POST/PUT/DELETE | `/api/projects` | Administrador |
| GET/POST/DELETE | `/api/assignments` | Administrador |
| GET/POST | `/api/hours` | Admin y Estudiante |
| PUT/DELETE | `/api/hours/:id` | Administrador |
| GET/POST | `/api/evidence` | Admin y Estudiante |
| GET | `/api/evidence/:id/file` | Admin y dueño de la evidencia |
| DELETE | `/api/evidence/:id` | Administrador |
| GET | `/api/reports/{students,projects,hours,evidence,general}` | Administrador |
| GET | `/api/dashboard/stats` | Administrador |

Las evidencias se cargan como `multipart/form-data` (campo `archivo`) y se almacenan localmente; se aceptan PDF, JPG y PNG (máx. 10 MB). La descarga pasa por `/api/evidence/:id/file`, que valida el token y comprueba que el estudiante solo pueda abrir las suyas — los archivos **no** se sirven como estáticos públicos.

## Reglas de negocio

- Un estudiante solo puede registrar horas o subir evidencias en proyectos **a los que está asignado** (`409` en caso contrario).
- Un proyecto **no se puede eliminar** si tiene horas o evidencias registradas; en ese caso se cambia su estado a `INACTIVO`.
- Cada alumno tiene su propia meta de horas (`horasRequeridas`, 240 por omisión), que administra la coordinación.
- El estudiante puede editar sus datos de contacto vía `PUT /api/students/me`, pero no su estado ni su meta de horas.
- El correo de un usuario no es editable después del alta.
- Las contraseñas requieren un mínimo de 8 caracteres.

> Nota: los reportes se entregan en formato JSON estructurado. La exportación a PDF/Excel puede añadirse sobre estos mismos datos sin cambiar la lógica.

## Respuesta estándar

```json
{ "exito": true, "mensaje": "Operacion exitosa", "datos": {} }
```
