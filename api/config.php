<?php
/**
 * IMPULSO DIGITAL - Configuración de Base de Datos
 * ================================================
 * INSTRUCCIONES:
 * 1. Edita las credenciales con los datos de tu base de datos en Hostinger
 * 2. Sube este archivo a la carpeta api/ en tu public_html
 */

// ============================================
// CREDENCIALES DE BASE DE DATOS
// ============================================
// Encuentra estos datos en: Hostinger > Bases de Datos > Detalles
define('DB_HOST', 'localhost');           // Generalmente es localhost en Hostinger
define('DB_NAME', 'u519024156_impulso_db');  // Nombre de tu base de datos
define('DB_USER', 'u519024156_admin_gestion');    // Usuario de la base de datos
define('DB_PASS', '@Tobias09');  // Contraseña de la base de datos

// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================
define('APP_URL', 'https://nazadigital.de');          // URL de tu sitio
define('API_URL', 'https://nazadigital.de/api');      // URL de la API
define('UPLOAD_PATH', __DIR__ . '/../uploads/');     // Carpeta de subidas

// ============================================
// CONEXIÓN PDO A MYSQL
// ============================================
function getConnection()
{
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode(['error' => 'Error de conexión a la base de datos']));
    }
}

// ============================================
// HEADERS CORS (para que React pueda conectar)
// ============================================
function setCorsHeaders()
{
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================
function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function getJsonInput()
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
?>