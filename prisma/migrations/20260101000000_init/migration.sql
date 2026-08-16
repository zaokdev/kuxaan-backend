-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `rol` ENUM('ADMINISTRADOR', 'ESTUDIANTE') NOT NULL DEFAULT 'ESTUDIANTE',
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumnos` (
    `id_alumno` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `carrera` VARCHAR(120) NULL,
    `universidad` VARCHAR(120) NULL,
    `periodo_academico` VARCHAR(60) NULL,
    `telefono` VARCHAR(20) NULL,
    `estado` VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',

    UNIQUE INDEX `alumnos_id_usuario_key`(`id_usuario`),
    PRIMARY KEY (`id_alumno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proyectos` (
    `id_proyecto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_proyecto` VARCHAR(150) NOT NULL,
    `objetivo` TEXT NULL,
    `comunidad_beneficiada` VARCHAR(150) NULL,
    `responsable` VARCHAR(150) NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_termino` DATETIME(3) NULL,
    `estado` VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',

    PRIMARY KEY (`id_proyecto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asignaciones` (
    `id_asignacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_alumno` INTEGER NOT NULL,
    `id_proyecto` INTEGER NOT NULL,
    `fecha_asignacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `asignaciones_id_alumno_id_proyecto_key`(`id_alumno`, `id_proyecto`),
    PRIMARY KEY (`id_asignacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registro_horas` (
    `id_registro` INTEGER NOT NULL AUTO_INCREMENT,
    `id_alumno` INTEGER NOT NULL,
    `id_proyecto` INTEGER NOT NULL,
    `cantidad_horas` DOUBLE NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id_registro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidencias` (
    `id_evidencia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_alumno` INTEGER NOT NULL,
    `id_proyecto` INTEGER NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `tipo_archivo` VARCHAR(60) NOT NULL,
    `url_archivo` VARCHAR(255) NOT NULL,
    `fecha_subida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_evidencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alumnos` ADD CONSTRAINT `alumnos_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_alumno_fkey` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos`(`id_alumno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registro_horas` ADD CONSTRAINT `registro_horas_id_alumno_fkey` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos`(`id_alumno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registro_horas` ADD CONSTRAINT `registro_horas_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencias` ADD CONSTRAINT `evidencias_id_alumno_fkey` FOREIGN KEY (`id_alumno`) REFERENCES `alumnos`(`id_alumno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidencias` ADD CONSTRAINT `evidencias_id_proyecto_fkey` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos`(`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

