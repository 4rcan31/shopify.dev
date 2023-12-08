<?php

require_once "request.php";
require "connection.php";


$pdo = new Connection();

$stmt = $pdo->connection()->prepare('INSERT INTO usuarios (json_data) VALUES (?)');
$stmt->execute([json_encode(Request::data())]);






