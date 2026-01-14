<?php
// api/tickets.php

require_once 'db.php';

$conn = connect_db();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener un solo ticket por ID
            $id = intval($_GET['id']);
            $sql = "SELECT t.*, c.client_name, s.store_name
                    FROM tickets t
                    JOIN clients c ON t.client_id = c.id
                    JOIN stores s ON t.store_id = s.id
                    WHERE t.id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode(['success' => true, 'data' => $result->fetch_assoc()]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Ticket no encontrado']);
            }
            $stmt->close();
        } else {
            // Obtener todos los tickets
            $sql = "SELECT t.*, c.client_name, s.store_name
                    FROM tickets t
                    JOIN clients c ON t.client_id = c.id
                    JOIN stores s ON t.store_id = s.id
                    ORDER BY t.created_at DESC";
            $result = $conn->query($sql);
            $tickets = [];
            while ($row = $result->fetch_assoc()) {
                $tickets[] = $row;
            }
            echo json_encode(['success' => true, 'data' => $tickets]);
        }
        break;

    case 'POST':
        // Crear un nuevo ticket
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO tickets (client_id, store_id, assigned_user_id, status, priority, description)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiisss", $data['client_id'], $data['store_id'], $data['assigned_user_id'], $data['status'], $data['priority'], $data['description']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Ticket creado con éxito', 'id' => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al crear el ticket: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Actualizar un ticket existente
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id']);
        $sql = "UPDATE tickets SET client_id = ?, store_id = ?, assigned_user_id = ?, status = ?, priority = ?, description = ?
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiisssi", $data['client_id'], $data['store_id'], $data['assigned_user_id'], $data['status'], $data['priority'], $data['description'], $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Ticket actualizado con éxito']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el ticket: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Eliminar un ticket
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "DELETE FROM tickets WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Ticket eliminado con éxito']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el ticket: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID de ticket no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}

$conn->close();
?>
