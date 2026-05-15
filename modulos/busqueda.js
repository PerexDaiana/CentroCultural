// ===== MÓDULO DE BÚSQUEDA =====
// Lógica de filtrado y búsqueda de talleres

function inicializarBuscador() {
    const buscador = document.getElementById("buscador");
    
    if (!buscador) return;

    buscador.addEventListener("input", () => {
        filtrarTalleres();
    });
}

function filtrarTalleres() {
    const buscador = document.getElementById("buscador");
    const lista = document.getElementById("lista_talleres");

    if (!buscador || !lista) return;

    const texto = buscador.value.toLowerCase();
    const talleresData = obtenerTalleres();
    const talleresDOM = lista.querySelectorAll(".taller");

    talleresDOM.forEach((tallerDiv, index) => {
        const taller = talleresData[index];
        
        if (!taller) return;

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
}
