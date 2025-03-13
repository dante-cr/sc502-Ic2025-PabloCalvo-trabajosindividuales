<?php
$transacciones = [];

function registrarTransaccion($id, $descripcion, $monto) {
    global $transacciones;
    $transaccion = [
        'id' => $id,
        'descripcion' => $descripcion,
        'monto' => $monto
    ];
    array_push($transacciones, $transaccion);
}

function generarEstadoDeCuenta() {
    global $transacciones;

    $totalContado = 0;
    foreach ($transacciones as $transaccion) {
        $totalContado += $transaccion['monto'];
    }

    $interes = $totalContado * 0.026; 
    $cashBack = $totalContado * 0.001;
    $montoFinal = $totalContado + $interes - $cashBack;

    // Mostrar en pantalla
    echo "<h2>Estado de Cuenta</h2>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>ID</th><th>Descripción</th><th>Monto</th></tr>";
    foreach ($transacciones as $transaccion) {
        echo "<tr>
                <td>{$transaccion['id']}</td>
                <td>{$transaccion['descripcion']}</td>
                <td>₡" . number_format($transaccion['monto'], 0) . "</td>
              </tr>";
    }
    echo "</table>";
    echo "<br>";
    echo "<strong>Total de contado:</strong> ₡" . number_format($totalContado, 0) . "<br>";
    echo "<strong>Total con interés (2.6%):</strong> ₡" . number_format($totalContado + $interes, 0) . "<br>";
    echo "<strong>Cash back (0.1%):</strong> ₡" . number_format($cashBack, 0) . "<br>";
    echo "<strong>Monto final a pagar:</strong> ₡" . number_format($montoFinal, 0) . "<br>";

   
    $archivo = fopen('estado_cuenta.txt', 'w');
    fwrite($archivo, "Estado de Cuenta\n");
    fwrite($archivo, "----------------------------------------\n");
    foreach ($transacciones as $transaccion) {
        fwrite($archivo, "ID: {$transaccion['id']} - {$transaccion['descripcion']} - ₡" . number_format($transaccion['monto'], 0) . "\n");
    }
    fwrite($archivo, "----------------------------------------\n");
    fwrite($archivo, "Total de contado: ₡" . number_format($totalContado, 0) . "\n");
    fwrite($archivo, "Total con interés (2.6%): ₡" . number_format($totalContado + $interes, 0) . "\n");
    fwrite($archivo, "Cash back (0.1%): ₡" . number_format($cashBack, 0) . "\n");
    fwrite($archivo, "Monto final a pagar: ₡" . number_format($montoFinal, 0) . "\n");

    fclose($archivo);
    echo "<p>Estado de cuenta guardado en <strong>estado_cuenta.txt</strong></p>";
}
