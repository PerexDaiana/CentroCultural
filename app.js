// ===== APP.JS - ARCHIVO PRINCIPAL =====
// coordinador de todos los módulos

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar navegación
    actualizarNav();
    mostrarUsuario();

    // Inicializar mapa
    inicializarMapa();

    // Inicializar buscador
    inicializarBuscador();

    // Cargar contenido según la página actual
    const pagina = window.location.pathname;

    if (pagina.includes("misTalleres.html")) {
        mostrarMisTalleres(); 
    } else if (pagina.includes("index.html") || pagina.endsWith("/")) {
        mostrarTalleresDisponibles(); 
    }
});

