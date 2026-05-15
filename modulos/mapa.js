// ===== MÓDULO DE MAPA =====
// Inicialización, gestión de marcadores y geocodificación

let map;
let marcadores = [];
let tarjetas = [];

const iconoUbicacion = L.icon({
    iconUrl: 'img/ubicacion.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

function inicializarMapa() {
    map = L.map('map').setView([-34.5431, -58.7126], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
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

function agregarMarcador(lat, lng, texto) {
    L.marker([lat, lng]).addTo(map)
        .bindPopup(texto)
        .openPopup();
}

function limpiarMarcadores() {
    marcadores.forEach(m => map.removeLayer(m));
    marcadores = [];
}
