<?php
// api/clients.php

require_once 'db.php';

$conn = connect_db();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener un solo cliente por ID
            $id = intval($_GET['id']);
            $sql = "SELECT c.*, (SELECT COUNT(id) FROM tickets WHERE client_id = c.id AND status != 'Cerrado') as active_tickets
                    FROM clients c
                    WHERE c.id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                echo json_encode(['success' => true, 'data' => $result->fetch_assoc()]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
            }
            $stmt->close();
        } else {
            // Obtener todos los clientes
            $sql = "SELECT c.*, (SELECT COUNT(id) FROM tickets WHERE client_id = c.id AND status != 'Cerrado') as active_tickets
                    FROM clients c
                    ORDER BY c.client_name ASC";
            $result = $conn->query($sql);
            $clients = [];
            while ($row = $result->fetch_assoc()) {
                $clients[] = $row;
            }
            echo json_encode(['success' => true, 'data' => $clients]);
        }
        break;

    case 'POST':
        // Crear un nuevo cliente
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO clients (client_name, contact_person, email, phone, logo_url, status)
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $data['client_name'], $data['contact_person'], $data['email'], $data['phone'], $data['logo_url'], $data['status']);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Cliente creado con éxito', 'id' => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al crear el cliente: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Actualizar un cliente existente
        $data = json_decode(file_get_contents('php://input'), true);
        $id = intval($data['id']);
        $sql = "UPDATE clients SET client_name = ?, contact_person = ?, email = ?, phone = ?, logo_url = ?, status = ?
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssi", $data['client_name'], $data['contact_person'], $data['email'], $data['phone'], $data['logo_url'], $data['status'], $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Cliente actualizado con éxito']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el cliente: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Eliminar un cliente
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "DELETE FROM clients WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Cliente eliminado con éxito']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el cliente: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID de cliente no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}

$conn->close();
?>
