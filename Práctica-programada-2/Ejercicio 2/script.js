let usuarios = [];
let editandoIndex = null;

function agregarUsuario() {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();

    if (nombre === "" || email === "") {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (editandoIndex === null) {
  
        usuarios.push({ nombre, email });
    } else {

        usuarios[editandoIndex] = { nombre, email };
        editandoIndex = null;
    }

    limpiarFormulario();
    actualizarTabla();
}

function actualizarTabla() {
    let tbody = document.getElementById("listaUsuarios");
    tbody.innerHTML = "";

    usuarios.forEach((usuario, index) => {
        let fila = `<tr>
            <td>${index + 1}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarUsuario(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${index})">Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function editarUsuario(index) {
    document.getElementById("nombre").value = usuarios[index].nombre;
    document.getElementById("email").value = usuarios[index].email;
    editandoIndex = index;
}

function eliminarUsuario(index) {
    usuarios.splice(index, 1);
    actualizarTabla();
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
}
