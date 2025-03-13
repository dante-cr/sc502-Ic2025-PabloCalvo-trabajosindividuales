<?php
include 'funciones.php';

// Registrar algunas transacciones de ejemplo
registrarTransaccion(1, 'Compra en supermercado', 15000.00);
registrarTransaccion(2, 'Pago de servicios', 20050.50);
registrarTransaccion(3, 'Compra en línea', 12075.75);
registrarTransaccion(4, 'Pago de membresía', 8000.00);
registrarTransaccion(5, 'Compra colchón', 389000.00);

// Generar estado de cuenta
generarEstadoDeCuenta();
?>
