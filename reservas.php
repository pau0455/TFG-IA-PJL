<?php
// Permitir CORS 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Configuración de la base de datos
$host = '192.168.168.10';
$db   = 'restaurante';
$user = 'postgres';
$pass = '12345'; 
$port = '5432';

try {
    // Conexión a PostgreSQL mediante PDO
    $dsn = "pgsql:host=$host;port=$port;dbname=$db;";
    $pdo = new PDO($dsn, $user, $pass,[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // NUEVA CONSULTA SQL ADAPTADA AL ESQUEMA CABECERA-DETALLE
    $query = "
        SELECT 
            r.id_reserva,
            r.fecha_hora,
            r.numero_personas,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.telefono,
            l.ciudad AS local_ciudad,
            -- Subconsulta para sacar los menús de la nueva tabla 'reserva_detalle_menu'
            (
                SELECT STRING_AGG(m.nombre_m || ' (x' || rdm.cantidad || ')', ', ')
                FROM reserva_detalle_menu rdm
                JOIN menu m ON rdm.id_menu = m.id_menu
                WHERE rdm.id_reserva = r.id_reserva
            ) AS menu_nombre
        FROM reserva r
        JOIN clientes c ON r.dni_cliente = c.dni
        JOIN local l ON r.id_local = l.id_local
        ORDER BY r.fecha_hora ASC;
    ";

    $stmt = $pdo->query($query);
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver resultados en JSON
    echo json_encode($reservas);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error BBDD', 'detalle' => $e->getMessage()]);
}
?>
