<?php

require "connection.php";


$pdo = new Connection();

$stmt = $pdo->connection()->prepare('SELECT * FROM usuarios');
$stmt->execute();

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

var_dump($result);
?>
