<?php
// api/db.php

// api/db.php

// Cargar la configuración de la base de datos de forma segura
require_once 'config.php';

// Función para establecer la conexión a la base de datos
function connect_db() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Verificar si hay errores de conexión
    if ($conn->connect_error) {
        http_response_code(500);
        // Devolver un error JSON y terminar la ejecución
        echo json_encode([
            'success' => false,
            'message' => 'Error interno del servidor: No se pudo conectar a la base de datos.'
        ]);
        exit;
    }

    // Establecer el juego de caracteres a UTF-8 para evitar problemas con tildes y caracteres especiales
    $conn->set_charset("utf8");

    return $conn;
}

// Configurar las cabeceras para permitir el acceso desde el frontend (CORS)
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde cualquier origen. Para producción, es mejor restringirlo a tu dominio.
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Responder a las solicitudes OPTIONS (pre-vuelo de CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

?>
