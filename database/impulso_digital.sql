-- ============================================
-- IMPULSO DIGITAL - Script de Base de Datos
-- MySQL para Hostinger (phpMyAdmin)
-- ============================================
-- Instrucciones:
-- 1. Accede a phpMyAdmin desde tu panel de Hostinger
-- 2. Selecciona tu base de datos
-- 3. Ve a la pestaña "SQL"
-- 4. Copia y pega todo este contenido
-- 5. Haz clic en "Ejecutar"
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================
-- Tabla: company_settings (Marca Blanca)
-- ============================================
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Impulso Digital',
  `tagline` VARCHAR(150) NOT NULL DEFAULT 'Estrategia Operativa',
  `logo_url` TEXT,
  `primary_color` VARCHAR(7) NOT NULL DEFAULT '#f2a20d',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `company_settings` (`id`, `name`, `tagline`, `primary_color`) VALUES
(1, 'Impulso Digital', 'Estrategia Operativa', '#f2a20d');

-- ============================================
-- Tabla: users (Usuarios del Sistema)
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Administrador Maestro', 'Supervisor', 'Técnico', 'Cliente') NOT NULL DEFAULT 'Técnico',
  `group_name` VARCHAR(100),
  `avatar_url` TEXT,
  `permissions` JSON,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`name`, `email`, `password`, `role`, `group_name`) VALUES
('Alex Operador', 'alex@impulsodigital.com', '$2y$10$EXAMPLEHASH', 'Administrador Maestro', 'Dirección Central');

-- ============================================
-- Tabla: clients (Clientes / Empresas)
-- ============================================
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `logo_url` TEXT,
  `status` ENUM('Active', 'Critical', 'Idle') DEFAULT 'Active',
  `contact_email` VARCHAR(150),
  `contact_phone` VARCHAR(50),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: stores (Sucursales / Puntos de Servicio)
-- ============================================
CREATE TABLE IF NOT EXISTS `stores` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `client_id` INT(11) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `code` VARCHAR(50),
  `location` VARCHAR(255),
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: tickets (Órdenes de Trabajo)
-- ============================================
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ticket_code` VARCHAR(20) NOT NULL UNIQUE,
  `client_id` INT(11),
  `store_id` INT(11),
  `status` ENUM('Pendiente', 'Aprobado', 'En Proceso', 'Solucionado', 'Cerrado', 'Crítico') DEFAULT 'Pendiente',
  `priority` ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media',
  `type` ENUM('Correctivo', 'Preventivo', 'Emergencia') DEFAULT 'Correctivo',
  `category` VARCHAR(100),
  `description` TEXT,
  `technician_id` INT(11),
  `scheduled_date` DATE,
  `arrival_time` DATETIME,
  `completion_time` DATETIME,
  `customer_signature` TEXT,
  `budget_amount` DECIMAL(10,2) DEFAULT 0,
  `budget_status` ENUM('NP', 'PE', 'PA', 'PR') DEFAULT 'NP',
  `invoice_number` VARCHAR(50),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`technician_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: ticket_photos (Evidencias Fotográficas)
-- ============================================
CREATE TABLE IF NOT EXISTS `ticket_photos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` INT(11) NOT NULL,
  `photo_type` ENUM('before', 'during', 'after') DEFAULT 'during',
  `photo_url` TEXT NOT NULL,
  `caption` VARCHAR(255),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: materials_requests (Solicitudes de Insumos)
-- ============================================
CREATE TABLE IF NOT EXISTS `materials_requests` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `request_code` VARCHAR(20) NOT NULL UNIQUE,
  `ticket_id` INT(11),
  `technician_id` INT(11),
  `status` ENUM('Pendiente', 'Surtido', 'Cancelado') DEFAULT 'Pendiente',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`technician_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: materials_request_items (Ítems de Solicitud)
-- ============================================
CREATE TABLE IF NOT EXISTS `materials_request_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `request_id` INT(11) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `quantity` INT(11) DEFAULT 1,
  `source` ENUM('Taller', 'Compra') DEFAULT 'Taller',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`request_id`) REFERENCES `materials_requests`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: petty_cash (Caja Chica / Rendiciones)
-- ============================================
CREATE TABLE IF NOT EXISTS `petty_cash` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` INT(11),
  `amount` DECIMAL(10,2) NOT NULL,
  `concept` VARCHAR(255) NOT NULL,
  `voucher_number` VARCHAR(50),
  `detailed_description` TEXT,
  `evidence_image` TEXT,
  `expense_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: fleet (Vehículos de la Flota)
-- ============================================
CREATE TABLE IF NOT EXISTS `fleet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `model` VARCHAR(100) NOT NULL,
  `plate` VARCHAR(20) NOT NULL UNIQUE,
  `current_km` INT(11) DEFAULT 0,
  `next_service_km` INT(11) DEFAULT 10000,
  `vtv_expiry` DATE,
  `bto_enabled` TINYINT(1) DEFAULT 0,
  `active` TINYINT(1) DEFAULT 1,
  `last_km_update` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: store_documents (Documentos de Sucursales)
-- ============================================
CREATE TABLE IF NOT EXISTS `store_documents` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `store_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `file_url` TEXT NOT NULL,
  `file_size` VARCHAR(50),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
