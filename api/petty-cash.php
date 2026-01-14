<?php
/**
 * API: Petty Cash (Caja Chica)
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT pc.*, t.ticket_code FROM petty_cash pc LEFT JOIN tickets t ON pc.ticket_id = t.id WHERE pc.id = ?");
            $stmt->execute([$_GET['id']]);
            jsonResponse($stmt->fetch() ?: ['error' => 'Gasto no encontrado'], 404);
        } else {
            $stmt = $pdo->query("SELECT pc.*, t.ticket_code FROM petty_cash pc LEFT JOIN tickets t ON pc.ticket_id = t.id ORDER BY pc.expense_date DESC, pc.created_at DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonInput();
        $stmt = $pdo->prepare("INSERT INTO petty_cash (ticket_id, amount, concept, voucher_number, detailed_description, evidence_image, expense_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['ticket_id'] ?? null,
            $data['amount'] ?? 0,
            $data['concept'] ?? 'Gasto de campo',
            $data['voucher_number'] ?? null,
            $data['detailed_description'] ?? null,
            $data['evidence_image'] ?? null,
            $data['expense_date'] ?? date('Y-m-d')
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
        $allowed = ['ticket_id', 'amount', 'concept', 'voucher_number', 'detailed_description', 'evidence_image', 'expense_date'];
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
        $stmt = $pdo->prepare("UPDATE petty_cash SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Gasto actualizado']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM petty_cash WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Gasto eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>