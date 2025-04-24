<?php
require('db.php');
session_start();

header('Content-Type: application/json');

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
    exit;
}

$userId = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (!isset($_GET['task_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Falta el parámetro task_id"]);
            exit;
        }
        $taskId = $_GET['task_id'];
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE task_id = :task_id ORDER BY created_at ASC");
        $stmt->execute(['task_id' => $taskId]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($comments);
        break;

    case 'POST':
        $input = getJsonInput();
        if (!isset($input['task_id'], $input['comment'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO comments (task_id, user_id, comment) VALUES (:task_id, :user_id, :comment)");
        $stmt->execute([
            'task_id' => $input['task_id'],
            'user_id' => $userId,
            'comment' => $input['comment']
        ]);
        http_response_code(201);
        echo json_encode(["message" => "Comentario agregado exitosamente"]);
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Falta el ID del comentario"]);
            exit;
        }
        $input = getJsonInput();
        if (!isset($input['comment'])) {
            http_response_code(400);
            echo json_encode(["error" => "Comentario requerido"]);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE comments SET comment = :comment WHERE id = :id AND user_id = :user_id");
        $stmt->execute([
            'comment' => $input['comment'],
            'id' => $_GET['id'],
            'user_id' => $userId
        ]);
        echo json_encode(["message" => "Comentario actualizado"]);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Falta el ID del comentario"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = :id AND user_id = :user_id");
        $stmt->execute([
            'id' => $_GET['id'],
            'user_id' => $userId
        ]);
        echo json_encode(["message" => "Comentario eliminado"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
