-- Impulso Digital - Esquema de Base de Datos (MySQL)
-- Este script crea todas las tablas necesarias para la aplicación de gestión.

-- Tabla para la configuración de la marca blanca (datos de la empresa)
CREATE TABLE `company_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `slogan` VARCHAR(255),
  `logo_url` VARCHAR(255),
  `primary_color` VARCHAR(7) DEFAULT '#007bff'
);

-- Tabla para la gestión de usuarios y roles
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role` ENUM('Admin', 'Tecnico') NOT NULL DEFAULT 'Tecnico',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para la información de los clientes
CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `logo_url` VARCHAR(255),
  `status` VARCHAR(50) DEFAULT 'Activo'
);

-- Tabla para las sucursales o puntos de servicio de los clientes
CREATE TABLE `stores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `store_name` VARCHAR(255) NOT NULL,
  `address` TEXT,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Tabla central para la gestión de tickets
CREATE TABLE `tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `store_id` INT NOT NULL,
  `assigned_user_id` INT,
  `status` ENUM('Abierto', 'En Progreso', 'Pendiente', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Abierto',
  `priority` ENUM('Baja', 'Media', 'Alta', 'Urgente') NOT NULL DEFAULT 'Media',
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`),
  FOREIGN KEY (`assigned_user_id`) REFERENCES `users`(`id`)
);

-- Tabla para los requerimientos de materiales asociados a un ticket
CREATE TABLE `materials_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` INT NOT NULL,
  `material_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `status` ENUM('Solicitado', 'Aprobado', 'Rechazado') NOT NULL DEFAULT 'Solicitado',
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE
);

-- Tabla para el registro de gastos y caja chica por ticket
CREATE TABLE `petty_cash` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `expense_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE
);

-- Tabla para el control de la flota de vehículos
CREATE TABLE `fleet` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vehicle_name` VARCHAR(255) NOT NULL,
  `license_plate` VARCHAR(20) UNIQUE,
  `mileage` INT,
  `service_alert` BOOLEAN DEFAULT FALSE,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos iniciales para la configuración de la empresa (ejemplo)
INSERT INTO `company_settings` (`company_name`, `slogan`, `logo_url`, `primary_color`) VALUES
('Impulso Digital', 'Estrategia Operativa Centralizada', 'assets/logo.png', '#0D9488');

-- Insertar un usuario administrador inicial
-- Se recomienda crear el primer usuario administrador a través de un script de registro seguro
-- que genere un hash de contraseña fuerte (ej. usando password_hash() en PHP).
-- Ejemplo de inserción manual (reemplazar con un hash seguro):
-- INSERT INTO `users` (`username`, `password_hash`, `email`, `role`) VALUES
-- ('admin', '$2y$10$un_hash_de_contraseña_muy_seguro', 'admin@impulsodigital.com', 'Admin');
