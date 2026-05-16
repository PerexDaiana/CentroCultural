// ===== MÓDULO DE AUTENTICACIÓN =====
// Gestión de registro, login, sesiones y navegación

function obtenerColaboradores() {

    let colaboradores =
        JSON.parse(localStorage.getItem("colaboradoresPortal")) || [];

    // Crear Admin 
    const existeAdmin = colaboradores.find(
        c => c.correo === "admin@ungs.com"
    );

    if (!existeAdmin) {

        colaboradores.push({
            id: 0,
            nombre: "Administrador",
            apellido: "UNGS",
            correo: "admin@ungs.com",
            contrasenia: "Admin123",
            rol: "moderador"
        });

        guardarColaboradores(colaboradores);
    }

    return colaboradores;
}

function guardarColaboradores(lista) {
    localStorage.setItem("colaboradoresPortal", JSON.stringify(lista));
}

function registrarColaborador() {
    const nombre = document.getElementById("nombre_colaborador").value.trim();
    const apellido = document.getElementById("apellido_colaborador").value.trim();
    const telefono = document.getElementById("numero_telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia_asociada").value;

    // Limpiar errores previos
    limpiarError("nombre_colaborador");
    limpiarError("apellido_colaborador");
    limpiarError("numero_telefono");
    limpiarError("correo");
    limpiarError("contrasenia_asociada");

    // Validaciones
    let validNombre = validarNombre(nombre);
    let validApellido = validarApellido(apellido);
    let validTelefono = validarTelefono(telefono);
    let validEmail = validarEmail(correo);
    let validPass = validarContrasenia(contrasenia);

    if (!validNombre.valido) {
        mostrarError("nombre_colaborador", validNombre.error);
        return;
    }
    if (!validApellido.valido) {
        mostrarError("apellido_colaborador", validApellido.error);
        return;
    }
    if (!validTelefono.valido) {
        mostrarError("numero_telefono", validTelefono.error);
        return;
    }
    if (!validEmail.valido) {
        mostrarError("correo", validEmail.error);
        return;
    }
    if (!validPass.valido) {
        mostrarError("contrasenia_asociada", validPass.error);
        return;
    }

    // Crear nuevo colaborador
    const idColaborador = Date.now();
    const nuevoColaborador = {
        id: idColaborador,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        correo: correo,
        contrasenia: contrasenia,
        rol: "colaborador"
    };

    let colaboradoresPortal = obtenerColaboradores();
    colaboradoresPortal.push(nuevoColaborador);
    guardarColaboradores(colaboradoresPortal);
    localStorage.setItem("usuarioActivo", JSON.stringify(nuevoColaborador));

    alert("¡Registro exitoso! Bienvenido al Centro Cultural UNGS");
    window.location.href = "pantallaUsuario.html";
}

function iniciarSesion() {
    const correoLogin = document.getElementById("email_login").value.trim();
    const contraseniaLogin = document.getElementById("contrasenia_login").value;

    // Limpiar errores previos
    limpiarError("email_login");
    limpiarError("contrasenia_login");

    // Validaciones de campos
    if (!noEstaVacio(correoLogin)) {
        mostrarError("email_login", "El email es obligatorio");
        return;
    }
    if (!noEstaVacio(contraseniaLogin)) {
        mostrarError("contrasenia_login", "La contraseña es obligatoria");
        return;
    }

    let colaboradoresPortal = obtenerColaboradores();
    const usuarioRegistrado = colaboradoresPortal.find(c =>
        c.correo === correoLogin && c.contrasenia === contraseniaLogin
    );

    if (usuarioRegistrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioRegistrado));
        // Redirección segín
        if (usuarioRegistrado.rol === "moderador") {
            window.location.href = "moderador.html";
        } else {
            window.location.href = "pantallaUsuario.html";
        }
    } else {
        mostrarError("contrasenia_login", "Usuario o contraseña incorrecta");
    }
}

function obtenerUsuarioActivo() {
    return JSON.parse(localStorage.getItem("usuarioActivo"));
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}

function mostrarUsuario() {
    const usuarioActivo = obtenerUsuarioActivo();
    console.log(usuarioActivo);
    if (usuarioActivo) {
        const mostrarActividad = document.getElementById("usuario_nombre");
        if (mostrarActividad) {
            mostrarActividad.innerText = usuarioActivo.nombre + " " + usuarioActivo.apellido;
        }
    }
}

function actualizarNav() {
    console.log("ENTRÓ A actualizarNav");
    const nav = document.getElementById("nav-principal");

    if (!nav) return;
    const usuario = localStorage.getItem("usuarioActivo");
    const pagina = window.location.pathname;

    if (
        pagina.includes("misTalleres.html") ||
        pagina.includes("pantallaUsuario.html")
    ) {
        return;
    }

    if (usuario) {
        nav.innerHTML = `
            <a href="misTalleres.html">Mis talleres</a>
            <a href="#Mapa">Centros</a>
            <button onclick="cerrarSesion()">Cerrar sesión</button>
        `;

        const seccionAcerca =
            document.getElementById("registroAsociado");
        if (seccionAcerca) {
            seccionAcerca.style.display = "none";
        }

    } else {
        nav.innerHTML = `
            <a href="#AcercaDeNosotros">Conocenos</a>
            <a href="#registroAsociado">Inicia Sesion</a>
            <a href="#Mapa">Centros</a>
        `;
    }
}