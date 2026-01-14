<?php
/**
 * API: Users
 * Endpoints para gestión de usuarios y autenticación
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT id, name, email, role, group_name, avatar_url, permissions, active FROM users WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $user = $stmt->fetch();
            if ($user && $user['permissions']) {
                $user['permissions'] = json_decode($user['permissions'], true);
            }
            jsonResponse($user ?: ['error' => 'Usuario no encontrado'], $user ? 200 : 404);
        } else {
            $stmt = $pdo->query("SELECT id, name, email, role, group_name, avatar_url, active FROM users ORDER BY name");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJsonInput();

        // Verificar si es login
        if (isset($data['action']) && $data['action'] === 'login') {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND active = 1");
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch();
            if ($user && password_verify($data['password'], $user['password'])) {
                unset($user['password']);
                jsonResponse(['success' => true, 'user' => $user]);
            } else {
                jsonResponse(['error' => 'Credenciales inválidas'], 401);
            }
        }

        // Crear nuevo usuario
        if (!isset($data['email']) || !isset($data['password'])) {
            jsonResponse(['error' => 'Email y contraseña requeridos'], 400);
        }
        $hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, group_name, permissions) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'] ?? 'Nuevo Usuario',
            $data['email'],
            $hash,
            $data['role'] ?? 'Técnico',
            $data['group_name'] ?? null,
            isset($data['permissions']) ? json_encode($data['permissions']) : null
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
        $allowed = ['name', 'email', 'role', 'group_name', 'avatar_url', 'active'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }
        if (isset($data['permissions'])) {
            $fields[] = "permissions = ?";
            $values[] = json_encode($data['permissions']);
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $fields[] = "password = ?";
            $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        if (empty($fields)) {
            jsonResponse(['error' => 'No hay campos para actualizar'], 400);
        }
        $values[] = $data['id'];
        $stmt = $pdo->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
        jsonResponse(['success' => true, 'message' => 'Usuario actualizado']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['error' => 'ID requerido'], 400);
        }
        $stmt = $pdo->prepare("UPDATE users SET active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Usuario desactivado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>