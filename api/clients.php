<?php
/**
 * API: Clients
 * Endpoints para gestión de clientes
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $client = $stmt->fetch();

            if ($client) {
                // Obtener sucursales del cliente
                $storesStmt = $pdo->prepare("SELECT * FROM stores WHERE client_id = ?");
                $storesStmt->execute([$_GET['id']]);
                $client['stores'] = $storesStmt->fetchAll();

                // Contar tickets activos
                $ticketsStmt = $pdo->prepare("SELECT COUNT(*) as count FROM tickets WHERE client_id = ? AND status NOT IN ('Cerrado', 'Solucionado')");
                $ticketsStmt->execute([$_GET['id']]);
                $client['active_tickets'] = $ticketsStmt->fetch()['count'];
            }

            jsonResponse($client ?: ['error' => 'Cliente no encontrado'], $client ? 200 : 404);
        } else {
            $stmt = $pdo->query("SELECT c.*, 
                                (SELECT COUNT(*) FROM stores WHERE client_id = c.id) as stores_count,
                                (SELECT COUNT(*) FROM tickets WHERE client_id = c.id AND status NOT IN ('Cerrado', 'Solucionado')) as active_tickets
                                FROM clients c ORDER BY c.name");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $stmt = $pdo->prepare("INSERT INTO clients (name, logo_url, status, contact_email, contact_phone, notes) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'] ?? 'Nuevo Cliente',
            $data['logo_url'] ?? null,
            $data['status'] ?? 'Active',
            $data['contact_email'] ?? null,
            $data['contact_phone'] ?? null,
            $data['notes'] ?? null
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
        $allowed = ['name', 'logo_url', 'status', 'contact_email', 'contact_phone', 'notes'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }
        if (empty($fields)) {
            jsonResponse(['error' => 'No hay campos para actualizar'], 400);
        }
        $values[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE clients SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Cliente actualizado']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM clients WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Cliente eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>