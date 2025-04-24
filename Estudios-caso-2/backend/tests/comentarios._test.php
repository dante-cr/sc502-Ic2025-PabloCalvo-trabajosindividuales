<?php
session_start();
$_SESSION['user_id'] = 1;

require('../db.php');

echo "<h1>Prueba de CRUD para comentarios</h1>";

$task_id = 1;
$comentario = "Este es un comentario de prueba";

$stmt = $pdo->prepare("INSERT INTO comments (task_id, comment) VALUES (?, ?)");
$stmt->execute([$task_id, $comentario]);
$new_comment_id = $pdo->lastInsertId();

echo "<h2>POST - Crear comentario</h2>";
echo "ID nuevo comentario: $new_comment_id<br>";

$comentario_actualizado = "Este es un comentario actualizado";

$stmt = $pdo->prepare("UPDATE comments SET comment = ? WHERE id = ?");
$stmt->execute([$comentario_actualizado, $new_comment_id]);

echo "<h2>PUT - Actualizar comentario</h2>";
echo "Comentario actualizado con éxito.<br>";

$stmt = $pdo->prepare("SELECT * FROM comments WHERE task_id = ?");
$stmt->execute([$task_id]);
$comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h2>GET - Listar comentarios por tarea</h2>";
echo "<pre>";
print_r($comentarios);
echo "</pre>";

$stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
$stmt->execute([$new_comment_id]);

echo "<h3>DELETE - Eliminar comentario</h3>";
echo "Comentario eliminado con éxito.<br>";
?>