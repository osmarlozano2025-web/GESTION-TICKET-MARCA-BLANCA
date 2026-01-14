<?php
/**
 * API: Settings
 * Endpoints para configuración de marca blanca
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM company_settings WHERE id = 1");
        $settings = $stmt->fetch();
        jsonResponse($settings ?: [
            'name' => 'Impulso Digital',
            'tagline' => 'Estrategia Operativa',
            'logo_url' => '',
            'primary_color' => '#f2a20d'
        ]);
        break;

    case 'PUT':
        $data = getJsonInput();
        $fields = [];
        $values = [];
        $allowed = ['name', 'tagline', 'logo_url', 'primary_color'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }
        if (empty($fields)) {
            jsonResponse(['error' => 'No hay campos para actualizar'], 400);
        }
        $stmt = $pdo->prepare("UPDATE company_settings SET " . implode(', ', $fields) . " WHERE id = 1");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Configuración guardada']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>