
<<<<<<< HEAD
function obtenerColaboradores(){
    return JSON.parse(localStorage.getItem("colaboradoresPortal")) || [];
}

function guardarColaboradores(lista){
    localStorage.setItem("colaboradoresPortal", JSON.stringify(lista));
}
 

function registrarColaborador(){
    const nombre = document.getElementById("nombre_colaborador").value.trim();
    const apellido = document.getElementById("apellido_colaborador").value.trim();
    const telefono = document.getElementById("numero_telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia_asociada").value;
    
    if (!nombre || !apellido || !correo || !contrasenia){
        alert("Complete todos los campos.");
        return; 
    }

    let colaboradoresPortal = obtenerColaboradores();
    const colaboradorRegistrado = colaboradoresPortal.some( c => c.correo.toLowerCase() === correo.toLowerCase());

    //Cambiar por algun style que figure en la pag y no como alerta
    if (colaboradorRegistrado){
        alert("Usted ya se encuentra registrado!");
        return;
    }

    
    //Generar ID a cada colaborador para poder asociar sus cursos
    let idColaborador = colaboradoresPortal.length > 0 ? colaboradoresPortal[colaboradoresPortal.length-1].id + 1 : 1;

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

    localStorage.setItem("colaboradoresPortal", JSON.stringify(colaboradoresPortal));

    //Limpiamos casillas
    //document.querySelector(".registro_colaborador").reset();

    //Este será el inicio de sesion, donde la persona podra registrar su taller
    window.location.href="pantallaUsuario.html";

}

function iniciarSesion(){
    const correoLogin = document.getElementById("email_login").value.trim();
    const contraseniaLogin = document.getElementById("contrasenia_login").value;
    let colaboradoresPortal = obtenerColaboradores();
    const usuarioRegistrado = colaboradoresPortal.find (c => c.correo === correoLogin && c.contrasenia===contraseniaLogin);

    if (usuarioRegistrado){
        //Guardamos la sesión
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioRegistrado));
        window.location.href="pantallaUsuario.html";
    } else{
        alert("Usuario o contraseña incorrecta");
    }
    
}

function obtenerUsuarioActivo(){
    return JSON.parse(localStorage.getItem("usuarioActivo"));
}

function mostrarUsuario(){
    const usuarioActivo = obtenerUsuarioActivo();

    if (usuarioActivo){
        const mostrarActividad = document.getElementById("usuario_nombre");
        if (mostrarActividad){
            mostrarActividad.innerText= usuarioActivo.nombre + " " + usuarioActivo.apellido;
        }
    }

}

function cerrarSesion(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}

function obtenerTalleres() {
    return JSON.parse(localStorage.getItem("talleres")) || [];
}

function guardarTalleres(lista) {
    localStorage.setItem("talleres", JSON.stringify(lista));
}

function registrarTaller(){
    const usuario = obtenerUsuarioActivo();
    const nombre = document.getElementById("nombre_taller").value.trim();
    const descripcion = document.getElementById("descripcion_taller").value.trim();
    const rubro = document.getElementById("rubro_taller").value.trim();
    const actividades = document.getElementById("actividades_taller").value.trim();
    const direccion = document.getElementById("direccion_taller").value.trim();
    const horarios = document.getElementById("horarios_taller").value.trim();
    const contacto = document.getElementById("contacto_taller").value.trim();
    const redes = document.getElementById("redes_taller").value.trim();
    const foto = document.getElementById("foto_taller").value.trim();

    if (!nombre || !descripcion || !rubro){
        alert("Complete los campos obligatorios");
        return;
    }

    let talleres = obtenerTalleres();

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
        estado: "aprobado"
    };

    talleres.push(nuevoTaller);
    guardarTalleres(talleres);

    alert("Taller registrado (pendiente de aprobación)");

    document.querySelector(".formulario form").reset();


    mostrarTalleresDisponibles();
}




/*function mostrarTalleres(){
    const usuario = obtenerUsuarioActivo();
    const contenedor = document.getElementById("lista_talleres");

    let talleres = obtenerTalleres();

    const misTalleres = talleres.filter(t => t.idColaborador === usuario.id);

    let html = "";

    misTalleres.forEach(t => {
        html += `
            <div class="taller">
                <h3>${t.nombre}</h3>
                <p>${t.descripcion}</p>
                <p><strong>Estado:</strong> ${t.estado}</p>
                <hr>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}*/


function mostrarTalleresDisponibles(){
    const usuario = obtenerUsuarioActivo();
    const contenedor = document.getElementById("lista_talleres");
    let talleres = obtenerTalleres();

    let html = "";
    talleres.forEach(t => {

        html += `
            <div class="taller">
            <img src="${t.foto || 'https://via.placeholder.com/300'}">
                <h3>${t.nombre}</h3>
                <p>${t.descripcion}</p>
                <p>${t.actividades}</p>
                <p>${t.direccion}</p>
                <p>${t.horarios}</p>
                
            </div>
        `;
    });

    contenedor.innerHTML = html;
}
let map;

//Inicio de mapa
function inicializarMapa() {
    map = L.map('map').setView([-34.5431, -58.7126], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}
document.addEventListener("DOMContentLoaded", function () {
    inicializarMapa();
    mostrarTalleresDisponibles();
});

//Para asociar a cada taller y su direccion!
function agregarMarcador(lat, lng, texto) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup(texto)
        .openPopup();
}
=======
>>>>>>> 51682b926415e56b15f04551a01803a2b9f500c6
