<?php
/**
 * API: Tickets
 * Endpoints para gestión de tickets
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        // Obtener todos los tickets o uno específico
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT t.*, c.name as client_name, s.name as store_name, u.name as technician_name 
                                   FROM tickets t 
                                   LEFT JOIN clients c ON t.client_id = c.id 
                                   LEFT JOIN stores s ON t.store_id = s.id 
                                   LEFT JOIN users u ON t.technician_id = u.id 
                                   WHERE t.id = ?");
            $stmt->execute([$_GET['id']]);
            $ticket = $stmt->fetch();
            jsonResponse($ticket ?: ['error' => 'Ticket no encontrado'], $ticket ? 200 : 404);
        } else {
            $status = $_GET['status'] ?? null;
            $query = "SELECT t.*, c.name as client_name, s.name as store_name, u.name as technician_name 
                      FROM tickets t 
                      LEFT JOIN clients c ON t.client_id = c.id 
                      LEFT JOIN stores s ON t.store_id = s.id 
                      LEFT JOIN users u ON t.technician_id = u.id";
            if ($status) {
                $query .= " WHERE t.status = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$status]);
            } else {
                $stmt = $pdo->query($query . " ORDER BY t.created_at DESC");
            }
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        // Crear nuevo ticket
        $data = getJsonInput();
        $code = 'TK-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT);
        $stmt = $pdo->prepare("INSERT INTO tickets (ticket_code, client_id, store_id, status, priority, type, category, description, technician_id, scheduled_date) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $code,
            $data['client_id'] ?? null,
            $data['store_id'] ?? null,
            $data['status'] ?? 'Pendiente',
            $data['priority'] ?? 'Media',
            $data['type'] ?? 'Correctivo',
            $data['category'] ?? null,
            $data['description'] ?? null,
            $data['technician_id'] ?? null,
            $data['scheduled_date'] ?? null
        ]);
        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId(), 'ticket_code' => $code], 201);
        break;

    case 'PUT':
        // Actualizar ticket existente
        $data = getJsonInput();
        if (!isset($data['id'])) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $fields = [];
        $values = [];
        $allowed = [
            'status',
            'priority',
            'type',
            'category',
            'description',
            'technician_id',
            'scheduled_date',
            'arrival_time',
            'completion_time',
            'customer_signature',
            'budget_amount',
            'budget_status',
            'invoice_number',
            'notes'
        ];
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
        $stmt = $pdo->prepare("UPDATE tickets SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Ticket actualizado']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM tickets WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Ticket eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>