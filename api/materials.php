<?php
/**
 * API: Materials (Solicitudes de Materiales)
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT mr.*, t.ticket_code, u.name as technician_name 
                                   FROM materials_requests mr 
                                   LEFT JOIN tickets t ON mr.ticket_id = t.id 
                                   LEFT JOIN users u ON mr.technician_id = u.id 
                                   WHERE mr.id = ?");
            $stmt->execute([$_GET['id']]);
            $request = $stmt->fetch();
            if ($request) {
                $itemsStmt = $pdo->prepare("SELECT * FROM materials_request_items WHERE request_id = ?");
                $itemsStmt->execute([$request['id']]);
                $request['items'] = $itemsStmt->fetchAll();
            }
            jsonResponse($request ?: ['error' => 'Solicitud no encontrada'], $request ? 200 : 404);
        } else {
            $stmt = $pdo->query("SELECT mr.*, t.ticket_code, u.name as technician_name,
                                (SELECT COUNT(*) FROM materials_request_items WHERE request_id = mr.id) as items_count
                                FROM materials_requests mr 
                                LEFT JOIN tickets t ON mr.ticket_id = t.id 
                                LEFT JOIN users u ON mr.technician_id = u.id 
                                ORDER BY mr.created_at DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $code = 'REQ-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);

        $stmt = $pdo->prepare("INSERT INTO materials_requests (request_code, ticket_id, technician_id, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $code,
            $data['ticket_id'] ?? null,
            $data['technician_id'] ?? null,
            $data['status'] ?? 'Pendiente'
        ]);
        $requestId = $pdo->lastInsertId();

        // Insertar items
        if (isset($data['items']) && is_array($data['items'])) {
            $itemStmt = $pdo->prepare("INSERT INTO materials_request_items (request_id, description, quantity, source) VALUES (?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $itemStmt->execute([
                    $requestId,
                    $item['description'] ?? 'Item sin descripción',
                    $item['quantity'] ?? 1,
                    $item['source'] ?? 'Taller'
                ]);
            }
        }

        jsonResponse(['success' => true, 'id' => $requestId, 'request_code' => $code], 201);
        break;

    case 'PUT':
        $data = getJsonInput();
        if (!isset($data['id'])) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }

        // Actualizar solicitud
        if (isset($data['status'])) {
            $stmt = $pdo->prepare("UPDATE materials_requests SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
        }

        // Actualizar items si se proporcionan
        if (isset($data['items']) && is_array($data['items'])) {
            // Eliminar items existentes
            $pdo->prepare("DELETE FROM materials_request_items WHERE request_id = ?")->execute([$data['id']]);
            // Insertar nuevos items
            $itemStmt = $pdo->prepare("INSERT INTO materials_request_items (request_id, description, quantity, source) VALUES (?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $itemStmt->execute([
                    $data['id'],
                    $item['description'] ?? 'Item sin descripción',
                    $item['quantity'] ?? 1,
                    $item['source'] ?? 'Taller'
                ]);
            }
        }

        jsonResponse(['success' => true, 'message' => 'Solicitud actualizada']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM materials_requests WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Solicitud eliminada']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>