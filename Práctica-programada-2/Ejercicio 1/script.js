function calcularDeducciones() {
    let salarioBruto = parseFloat(document.getElementById("salario").value);

    if (isNaN(salarioBruto) || salarioBruto <= 0) {
        alert("Por favor, ingrese un salario válido.");
        return;
    }

    // Cálculo de cargas sociales (10.5%)
    let cargasSociales = salarioBruto * 0.105;

    // Cálculo del impuesto sobre la renta
    let impuestoRenta = 0;
    if (salarioBruto > 4845000) {
        impuestoRenta += (salarioBruto - 4845000) * 0.25;
        salarioBruto = 4845000;
    }
    if (salarioBruto > 2423000) {
        impuestoRenta += (salarioBruto - 2423000) * 0.20;
        salarioBruto = 2423000;
    }
    if (salarioBruto > 1381000) {
        impuestoRenta += (salarioBruto - 1381000) * 0.15;
        salarioBruto = 1381000;
    }
    if (salarioBruto > 941000) {
        impuestoRenta += (salarioBruto - 941000) * 0.10;
    }

    // Para el cálculo del salario neto
    let salarioNeto = parseFloat(document.getElementById("salario").value) - cargasSociales - impuestoRenta;

    // Para mostrar
    document.getElementById("cargasSociales").textContent = cargasSociales.toLocaleString();
    document.getElementById("impuestoRenta").textContent = impuestoRenta.toLocaleString();
    document.getElementById("salarioNeto").textContent = salarioNeto.toLocaleString();
}