<?php
/**
 * API: Fleet (Flota de Vehículos)
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM fleet WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            jsonResponse($stmt->fetch() ?: ['error' => 'Vehículo no encontrado'], 404);
        } else {
            $stmt = $pdo->query("SELECT * FROM fleet WHERE active = 1 ORDER BY model");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $stmt = $pdo->prepare("INSERT INTO fleet (model, plate, current_km, next_service_km, vtv_expiry, bto_enabled) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['model'] ?? 'Nuevo Vehículo',
            $data['plate'] ?? '',
            $data['current_km'] ?? 0,
            $data['next_service_km'] ?? 10000,
            $data['vtv_expiry'] ?? null,
            $data['bto_enabled'] ?? 0
        ]);
        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        if (!isset($data['id'])) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $fields = [];
        $values = [];
        $allowed = ['model', 'plate', 'current_km', 'next_service_km', 'vtv_expiry', 'bto_enabled', 'active'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }
        // Si se actualiza el KM, registrar la fecha
        if (isset($data['current_km'])) {
            $fields[] = "last_km_update = NOW()";
        }
        if (empty($fields)) {
            jsonResponse(['error' => 'No hay campos para actualizar'], 400);
        }
        $values[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE fleet SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Vehículo actualizado']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("UPDATE fleet SET active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Vehículo desactivado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>