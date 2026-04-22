const buscador = document.getElementById("buscador");
const lista = document.getElementById("lista_talleres");
let map;
let marcadores = [];
let tarjetas = [];


const iconoUbicacion = L.icon({
    iconUrl: 'img/ubicacion.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

//  COLABORADORES
function obtenerColaboradores() {
    return JSON.parse(localStorage.getItem("colaboradoresPortal")) || [];
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

    if (!nombre || !apellido || !correo || !contrasenia) {
        alert("Complete todos los campos.");
        return;
    }

    let colaboradoresPortal = obtenerColaboradores();
    const colaboradorRegistrado = colaboradoresPortal.some(c => c.correo.toLowerCase() === correo.toLowerCase());

    //Cambiar por algun style que figure en la pag y no como alerta
    if (colaboradorRegistrado) {
        alert("Usted ya se encuentra registrado!");
        return;
    }


    //Generar ID a cada colaborador para poder asociar sus cursos
    let idColaborador = colaboradoresPortal.length > 0 ? colaboradoresPortal[colaboradoresPortal.length - 1].id + 1 : 1;

    const nuevoColaborador = {
        id: idColaborador,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        correo: correo,
        contrasenia: contrasenia

    };

    //Guardamos al nuevo colaborador 
    colaboradoresPortal.push(nuevoColaborador);
    guardarColaboradores(colaboradoresPortal);

    localStorage.setItem("usuarioActivo", JSON.stringify(nuevoColaborador));

    window.location.href = "pantallaUsuario.html";

}

function mostrarMisTalleres() {
    const contenedor = document.getElementById("lista_talleres");
    const usuario = obtenerUsuarioActivo();
    let talleres = obtenerTalleres();
    const misTalleres = talleres.filter(t => t.idColaborador === usuario.id);

    contenedor.innerHTML = "";


    marcadores.forEach(m => map.removeLayer(m));
    marcadores = [];

    tarjetas = []; //sin let porque rompe

    if (misTalleres.length === 0) {
        contenedor.innerHTML = `<p class='lista-talleres-vacia'>
            Aún no tenés talleres disponibles, registrá el tuyo ingresando ->    
            <a href="pantallaUsuario.html" class="link-registrar">acá</a>
        </p>`;
        return;
    }

    misTalleres.forEach((t, index) => {

        let lat = t.lat;
        let lng = t.lng;

        const marcador = L.marker([lat, lng], { icon: iconoUbicacion })
            .addTo(map)
            .bindPopup(`<b>${t.nombre}</b><br>${t.direccion}`);

        marcadores.push(marcador);

        const div = document.createElement("div");
        tarjetas.push(div);
        div.classList.add("taller");

        div.dataset.index = index;

        div.innerHTML = `
            <img src="${t.foto || 'https://via.placeholder.com/300'}">
            <h3>${t.nombre}</h3>
            <p>${t.descripcion}</p>
            <p>${t.actividades}</p>
            <p>${t.direccion}</p>
            <p>${t.horarios}</p>
            <button onclick="eliminarTaller(${t.id})">Eliminar</button>
        `;

        div.addEventListener("click", () => {
            map.setView([lat, lng], 15);
            marcador.openPopup();
        });

        contenedor.appendChild(div);

        marcador.on("click", () => {
            const tarjeta = tarjetas[index];
            if (tarjeta) {
                tarjeta.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                tarjeta.style.border = "3px solid rgb(1, 103, 110)";
                setTimeout(() => {
                    tarjeta.style.border = "none";
                }, 1500);
            }
        });
    });
}
// INICIO DE SESION
function iniciarSesion() {
    const correoLogin = document.getElementById("email_login").value.trim();
    const contraseniaLogin = document.getElementById("contrasenia_login").value;
    let colaboradoresPortal = obtenerColaboradores(); const usuarioRegistrado = colaboradoresPortal.find(c => c.correo === correoLogin && c.contrasenia === contraseniaLogin);
    if (usuarioRegistrado) {
        //Guardamos la sesión
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioRegistrado));
        window.location.href = "pantallaUsuario.html";
        window.location.reload();
    } else {
        alert("Usuario o contraseña incorrecta");
    }

}

function obtenerUsuarioActivo() {
    return JSON.parse(localStorage.getItem("usuarioActivo"));
}



function mostrarUsuario() {
    const usuarioActivo = obtenerUsuarioActivo();

    if (usuarioActivo) {
        const mostrarActividad = document.getElementById("usuario_nombre");
        if (mostrarActividad) {
            mostrarActividad.innerText = usuarioActivo.nombre + " " + usuarioActivo.apellido;

        }
        
    }

}

document.addEventListener("DOMContentLoaded", () => {
    actualizarNav();
});

function actualizarNav() {
    const nav = document.getElementById("nav-principal");
    const usuario = localStorage.getItem("usuarioActivo");
    

    if (usuario) {
        nav.innerHTML = `
            <a href="misTalleres.html">Mis talleres</a>
            <a href="#Mapa">Centros</a>
            <button onclick="cerrarSesion()">Cerrar sesión</button>
            
        `;
        const seccionAcerca = document.getElementById("registroAsociado");

        if (seccionAcerca) {
        seccionAcerca.style.display = "none";
        }
    } else {
        nav.innerHTML = `
            <a href="#AcercaDeNosotros">Conocenos</a>
            <a href="#registroAsociado">Iniciar Sesion</a>
            <a href="#Mapa">Centros</a>
        `;
    }
}


function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}
// CENTROS
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

    if (!nombre || !descripcion || !rubro) {
        alert("Complete los campos obligatorios");
        return;
    }

    const direccion = document.getElementById("direccion_taller").value.trim();
    const coords = await obtenerCoordenadas(direccion);

    if (!coords) {
        alert("Dirección no válida. Usá formato: Calle 123, Localidad");
        return;
    }

    talleres = obtenerTalleres();

    let idTaller = talleres.length > 0
        ? talleres[talleres.length - 1].id + 1
        : 1;

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
        estado: "aprobado"
    };

    talleres.push(nuevoTaller);
    guardarTalleres(talleres);

    alert("Taller registrado (pendiente de aprobación)");

    document.querySelector(".formulario form").reset();
    mostrarMisTalleres();
}

function eliminarTaller(idTaller) {
    let talleres = obtenerTalleres();
    const usuario = obtenerUsuarioActivo();

    // Buscar el taller
    const taller = talleres.find(t => t.id == idTaller);

    if (!taller && !confirmar) {
        alert("Taller no encontrado");
        return;
    }

    // Validar que el usuario sea el dueño
    if (taller.idColaborador !== usuario.id) {
        alert("No tenés permiso para eliminar este taller");
        return;
    }

    // Confirmación
    const confirmar = confirm("¿Estás seguro de que querés eliminar este taller?");
    if (!confirmar) return;

    // Filtrar (eliminar)
    talleres = talleres.filter(t => t.id != idTaller);

    // Guardar cambios
    guardarTalleres(talleres);

    alert("Taller eliminado correctamente");

    // Refrescar vista
    mostrarMisTalleres();
}

// MAPA
function mostrarTalleresDisponibles() {
    const contenedor = document.getElementById("lista_talleres");
    let talleres = obtenerTalleres();

    contenedor.innerHTML = "";

    marcadores = [];
    let tarjetas = [];
    talleres.forEach((t, index) => {

        let lat = t.lat;
        let lng = t.lng;


        const marcador = L.marker([lat, lng], { icon: iconoUbicacion })
            .addTo(map)
            .bindPopup(`<b>${t.nombre}</b><br>${t.direccion}`);

        marcadores.push(marcador);

        const div = document.createElement("div");
        tarjetas.push(div);
        div.classList.add("taller");


        div.dataset.index = index;

        div.innerHTML = `
        <img src="${t.foto || 'https://via.placeholder.com/300'}">
         <h3>${t.nombre}</h3>
        <p>${t.descripcion}</p>
        <p>${t.actividades}</p>
        <p>${t.direccion}</p>
        <p>${t.horarios}</p>
    `;

        div.addEventListener("click", () => {
            map.setView([lat, lng], 15);
            marcador.openPopup();
        });

        contenedor.appendChild(div);
        marcador.on("click", () => {
            const tarjeta = tarjetas[index];
            if (tarjeta) {
                tarjeta.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                tarjeta.style.border = "3px solid rgb(1, 103, 110)";
                setTimeout(() => {
                    tarjeta.style.border = "none";
                }, 1500);
            }
        });
    });

}
async function obtenerCoordenadas(direccion) {
    try {
        const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(direccion)}&geocodificar=true`;

        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (data.direccionesNormalizadas && data.direccionesNormalizadas.length > 0) {
            const dir = data.direccionesNormalizadas[0];

            return {
                lat: dir.coordenadas.y,
                lng: dir.coordenadas.x
            };
        } else {
            return null;
        }

    } catch (error) {
        console.error("Error al normalizar la dirección:", error);
        return null;
    }
}

//Inicio de mapa
function inicializarMapa() {
    map = L.map('map').setView([-34.5431, -58.7126], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}
document.addEventListener("DOMContentLoaded", function () {
    inicializarMapa();

    const pagina = window.location.pathname;

    if (pagina.includes("misTalleres.html")) {
        mostrarMisTalleres(); 
    } else {
        mostrarTalleresDisponibles(); 
    }
});

//Para asociar a cada taller y su direccion!
function agregarMarcador(lat, lng, texto) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup(texto)
        .openPopup();
}

//  BUSCADOR

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const talleresData = obtenerTalleres(); // obtenemos los datos reales
    const talleresDOM = lista.querySelectorAll(".taller");

    talleresDOM.forEach((tallerDiv, index) => {
        const taller = talleresData[index];
        const marcador = marcadores[index];

        const coincide =
            taller.nombre.toLowerCase().includes(texto) ||
            taller.direccion.toLowerCase().includes(texto);

        if (coincide) {
            tallerDiv.style.display = "";

            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }

        } else {
            tallerDiv.style.display = "none";

            if (map.hasLayer(marcador)) {
                map.removeLayer(marcador);
            }
        }
    });
});

