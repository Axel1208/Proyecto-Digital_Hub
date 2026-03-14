-- =============================================
-- BASE DE DATOS: DIGITALHUB
-- =============================================

CREATE DATABASE IF NOT EXISTS digitalhub;
USE digitalhub;

-- =============================================
-- TABLA: usuario
-- =============================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    correo     VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol        ENUM('administrador', 'instructor', 'aprendiz') NOT NULL,
    estado     ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: ambiente
-- =============================================
CREATE TABLE IF NOT EXISTS ambiente (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    direccion   VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: ficha
-- =============================================
CREATE TABLE IF NOT EXISTS ficha (
    id_ficha           VARCHAR(20) PRIMARY KEY,
    programa_formacion VARCHAR(150) NOT NULL,
    jornada            ENUM('Mañana', 'Tarde', 'Noche') NOT NULL,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: portatil
-- =============================================
CREATE TABLE IF NOT EXISTS portatil (
    id_portatil INT AUTO_INCREMENT PRIMARY KEY,
    num_serie   VARCHAR(100) NOT NULL UNIQUE,
    marca       VARCHAR(100) NOT NULL,
    modelo      VARCHAR(100) NOT NULL,
    estado      ENUM('disponible', 'asignado', 'dañado', 'en reparacion') NOT NULL DEFAULT 'disponible',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: asignacion
-- =============================================
CREATE TABLE IF NOT EXISTS asignacion (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_portatil   INT NOT NULL,
    id_ficha      VARCHAR(20) NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_portatil) REFERENCES portatil(id_portatil),
    FOREIGN KEY (id_ficha)    REFERENCES ficha(id_ficha)
);

-- =============================================
-- TABLA: reportes
-- =============================================
CREATE TABLE IF NOT EXISTS reportes (
    id_reporte     INT AUTO_INCREMENT PRIMARY KEY,
    estado_reporte ENUM('pendiente', 'en proceso', 'resuelto') NOT NULL DEFAULT 'pendiente',
    fecha_reporte  DATE NOT NULL,
    archivo        VARCHAR(255),
    descripcion    TEXT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- DATOS INICIALES: usuario administrador
-- Contraseña: Admin123
-- =============================================
INSERT INTO usuario (nombre, correo, password_hash, rol, estado)
VALUES (
    'Administrador',
    'prueba_admin@digitalhub.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'administrador',
    'activo'
);
