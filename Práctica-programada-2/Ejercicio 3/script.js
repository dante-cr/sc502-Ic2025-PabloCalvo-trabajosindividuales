let productos = [];

function agregarProducto() {
    let nombre = document.getElementById("nombre").value.trim();
    let precio = document.getElementById("precio").value.trim();
    let categoria = document.getElementById("categoria").value;

    if (nombre === "" || precio === "" || categoria === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    productos.push({ nombre, precio: parseFloat(precio), categoria });
    limpiarFormulario();
    mostrarProductos();
}

function mostrarProductos(filtrados = productos) {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    if (filtrados.length === 0) {
        lista.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    filtrados.forEach((producto, index) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <p><strong>${producto.nombre}</strong> - $${producto.precio.toFixed(2)}</p>
            <p>Categoría: ${producto.categoria}</p>
            <button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        lista.appendChild(div);
    });
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    mostrarProductos();
}

function filtrarProductos() {
    let categoriaSeleccionada = document.getElementById("filtroCategoria").value;
    
    let productosFiltrados = categoriaSeleccionada === "Todos" 
        ? productos 
        : productos.filter(producto => producto.categoria === categoriaSeleccionada);

    mostrarProductos(productosFiltrados);
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
}
