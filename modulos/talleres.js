// ===== MÓDULO DE TALLERES =====
// Gestión de talleres: crear, eliminar, obtener, mostrar

function obtenerTalleres() {
    return JSON.parse(localStorage.getItem("talleres")) || [];
}

function guardarTalleres(lista) {
    localStorage.setItem("talleres", JSON.stringify(lista));
}

async function registrarTaller() {
    const usuario = obtenerUsuarioActivo();
    const nombre = document.getElementById("nombre_taller").value.trim();
    const descripcion = document.getElementById("descripcion_taller").value.trim();
    const rubro = document.getElementById("rubro_taller").value.trim();
    const actividades = document.getElementById("actividades_taller").value.trim();
    const horarios = document.getElementById("horarios_taller").value.trim();
    const contacto = document.getElementById("contacto_taller").value.trim();
    const redes = document.getElementById("redes_taller").value.trim();
    const foto = document.getElementById("foto_taller").value.trim();
    const direccion = document.getElementById("direccion_taller").value.trim();

    // Limpiar errores previos
    const campos = ["nombre_taller", "descripcion_taller", "rubro_taller", "direccion_taller", "contacto_taller"];
    campos.forEach(campo => limpiarError(campo));

    // Validaciones obligatorias
    let validNombre = validarNombreTaller(nombre);
    let validDesc = validarDescripcion(descripcion);
    let validRubro = validarRubro(rubro);
    let validDir = validarDireccion(direccion);
    let validContacto = validarTelefono(contacto);

    if (!validNombre.valido) {
        mostrarError("nombre_taller", validNombre.error);
        return;
    }
    if (!validDesc.valido) {
        mostrarError("descripcion_taller", validDesc.error);
        return;
    }
    if (!validRubro.valido) {
        mostrarError("rubro_taller", validRubro.error);
        return;
    }
    if (!validDir.valido) {
        mostrarError("direccion_taller", validDir.error);
        return;
    }
    if (!validContacto.valido) {
        mostrarError("contacto_taller", validContacto.error);
        return;
    }

    // Validar URL de foto si se proporciona
    if (noEstaVacio(foto)) {
        let validFoto = validarUrl(foto);
        if (!validFoto.valido) {
            mostrarError("foto_taller", validFoto.error);
            return;
        }
    }

    // Obtener coordenadas
    const coords = await obtenerCoordenadas(direccion);
    if (!coords) {
        mostrarError("direccion_taller", "No se pudo validar la dirección. Intenta: Calle 123, Localidad");
        return;
    }

    let talleres = obtenerTalleres();
    let idTaller = talleres.length > 0 ? talleres[talleres.length - 1].id + 1 : 1;

    const nuevoTaller = {
        id: idTaller,
        idColaborador: usuario.id,
        nombre,
        descripcion,
        rubro,
        actividades,
        direccion,
        horarios,
        contacto,
        redes,
        foto,
        lat: coords.lat,
        lng: coords.lng,
        estado: "pendiente"
    };

    talleres.push(nuevoTaller);
    guardarTalleres(talleres);

    alert("¡Taller registrado exitosamente! Quedó pendiente de aprobación.");

    document.querySelector(".formulario form").reset();
    campos.forEach(campo => limpiarError(campo));
    mostrarMisTalleres();
}

function eliminarTaller(idTaller) {
    let talleres = obtenerTalleres();
    const usuario = obtenerUsuarioActivo();

    const taller = talleres.find(t => t.id == idTaller);

    if (!taller) {
        alert("Taller no encontrado");
        return;
    }

    if (taller.idColaborador !== usuario.id) {
        alert("No tenés permiso para eliminar este taller");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que querés eliminar este taller?");
    if (!confirmar) return;

    talleres = talleres.filter(t => t.id != idTaller);
    guardarTalleres(talleres);
    alert("Taller eliminado correctamente");
    mostrarMisTalleres();
}
function filtrarTalleresPorEstado(talleres, estados) {

    return talleres.filter(
        t => estados.includes(t.estado)
    );
}

function obtenerTalleresPendientes() {

    return filtrarTalleresPorEstado(
        obtenerTalleres(),
        ["pendiente"]
    );
}

function obtenerTalleresAprobados() {

    return filtrarTalleresPorEstado(
        obtenerTalleres(),
        ["aprobado"]
    );
}

function mostrarMisTalleres() {
    const contenedor = document.getElementById("lista_talleres");
    const usuario = obtenerUsuarioActivo();
    let talleres = obtenerTalleres();
    const misTalleres = talleres.filter(t => t.idColaborador === usuario.id);
    const talleresVisibles = filtrarTalleresPorEstado(
        misTalleres,
        ["pendiente", "aprobado", "rechazado"]
    );
    contenedor.innerHTML = "";
    limpiarMarcadores();
    tarjetas = [];

    if (talleresVisibles.length === 0) {
        contenedor.innerHTML = `<p class='lista-talleres-vacia'>
            Aún no tenés talleres disponibles, registrá el tuyo ingresando ->    
            <a href="pantallaUsuario.html" class="link-registrar">acá</a>
        </p>`;
        return;
    }

    talleresVisibles.forEach((t, index) => {
        const marcador = crearMarcador(t, index, true);
        const tarjeta = crearTarjeta(t, index, marcador, true);
        contenedor.appendChild(tarjeta);
    });
}

function mostrarTalleresDisponibles() {

    const contenedor = document.getElementById("lista_talleres");
    let talleres = obtenerTalleres();

    talleres = talleres.filter(t => t.estado === "aprobado");

    contenedor.innerHTML = "";
    limpiarMarcadores();
    tarjetas = [];

    talleres.forEach((t, index) => {
        const marcador = crearMarcador(t, index, false);
        const tarjeta = crearTarjeta(t, index, marcador, false);
        contenedor.appendChild(tarjeta);
    });
}

function mostrarTalleresPendientes() {
    const contenedor = document.getElementById("lista_pendientes");
    let talleres = obtenerTalleresPendientes();
    contenedor.innerHTML = "";

    if (talleres.length === 0) {
        contenedor.innerHTML = "<p>No hay talleres pendientes.</p>";
        return;
    }

    talleres.forEach((taller) => {

        const div = document.createElement("div");
        div.classList.add("taller")
        div.innerHTML = `<h3>${taller.nombre}</h3>
            <p>${taller.descripcion}</p>
            <p><strong>Estado:</strong> ${taller.estado}</p>
            <button onclick="aprobarTaller(${taller.id})">Aprobar</button>
            <button onclick="rechazarTaller(${taller.id})">Rechazar</button>
        `;
        contenedor.appendChild(div);
    });
}

function crearMarcador(taller, index, esMio) {
    let lat = taller.lat;
    let lng = taller.lng;
    const marcador = L.marker([lat, lng], { icon: iconoUbicacion })
        .addTo(map)
        .bindPopup(`<b>${taller.nombre}</b><br>${taller.direccion}`);

    marcadores.push(marcador);

    marcador.on("click", () => {
        const tarjeta = tarjetas[index];
        if (tarjeta) {
            tarjeta.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            tarjeta.style.border = "3px solid rgb(1, 103, 110)";
            setTimeout(() => { tarjeta.style.border = "none"; }, 1500);
        }
    });
    return marcador;
}

function crearTarjeta(taller, index, marcador, esMio) {
    const div = document.createElement("div");
    tarjetas.push(div);
    div.classList.add("taller");
    div.dataset.index = index;
    const botonEliminar = esMio
        ? `<button onclick="eliminarTaller(${taller.id})">Eliminar</button>`
        : '';
    // Mostrar estado solo en Mis talleres
    const estadoHTML = esMio
        ? `<p><strong>Estado:</strong> ${taller.estado}</p>`
        : '';

    div.innerHTML = `
        <img src="${taller.foto || 'https://via.placeholder.com/300'}">
        <h3>${taller.nombre}</h3>
        <p>${taller.descripcion}</p>
        <p>${taller.actividades}</p>
        <p>${taller.direccion}</p>
        <p>${taller.horarios}</p>
        ${estadoHTML}
        ${botonEliminar}
    `;

    div.addEventListener("click", () => {
        if (!marcador) return;
        map.setView([taller.lat, taller.lng], 15);
        marcador.openPopup();
    });
    return div;
}

function manejarTipoUbicacion() {
    const tipo = document.getElementById("tipo_ubicacion").value;
    const contenedor = document.getElementById("contenedor_direccion");
    const inputDireccion = document.getElementById("direccion_taller");

    // No se seleccionó opción
    if (tipo === "") {
        contenedor.style.display = "none";
        inputDireccion.value = "";
        inputDireccion.disabled = false;
        return;
    }

    // Mostrar contenedor
    contenedor.style.display = "block";

    // Se dicta en Centro Cultural
    if (tipo === "SEDE") {
        inputDireccion.value = "Junín 1930, CABA";
        inputDireccion.disabled = true;
    }

    // Es taller particular
    else if (tipo === "PARTICULAR") {
        inputDireccion.value = "";
        inputDireccion.disabled = false;
    }
}

function aprobarTaller(idTaller) {
    let talleres = obtenerTalleres();
    const taller = talleres.find(t => t.id == idTaller);

    if (!taller) {
        alert("Taller no encontrado");
        return;
    }
    taller.estado = "aprobado";
    guardarTalleres(talleres);
    alert("Taller aprobado correctamente");
    mostrarTalleresPendientes();
}

function rechazarTaller(idTaller) {
    let talleres = obtenerTalleres();
    const taller = talleres.find(t => t.id == idTaller);

    if (!taller) {
        alert("Taller no encontrado");
        return;
    }
    taller.estado = "rechazado";
    guardarTalleres(talleres);
    alert("Taller rechazado");
    mostrarTalleresPendientes();
}