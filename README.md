# Centro Cultural UNGS — Portal Web de Actividades Culturales y Educativas

## Descripción del Proyecto

El **Portal Web del Centro Cultural UNGS** es una aplicación web de página múltiple desarrollada con tecnologías (HTML5, CSS3 y JavaScript), cuyo propósito es facilitar la difusión, búsqueda y registro de talleres y actividades culturales y educativas en el área de influencia de la Universidad Nacional de General Sarmiento (UNGS).

La aplicación permite a integrantes de la comunidad publicar sus propios talleres o centros culturales, y a cualquier visitante explorarlos mediante un listado interactivo con búsqueda por texto y visualización georreferenciada en mapa. No requiere infraestructura de servidor ni base de datos externa: toda la persistencia se gestiona mediante la API `localStorage` del navegador.

---

## Índice

- [Características principales](#características-principales)
- [Arquitectura y stack tecnológico](#arquitectura-y-stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos de la aplicación](#módulos-de-la-aplicación)
- [Flujos de usuario](#flujos-de-usuario)
- [Instrucciones de despliegue y ejecución](#instrucciones-de-despliegue-y-ejecución)
- [Dependencias externas](#dependencias-externas)
- [Consideraciones de seguridad y limitaciones](#consideraciones-de-seguridad-y-limitaciones)

---

## Características Principales

- **Exploración pública** de talleres y centros culturales sin necesidad de autenticación, a menos que se desee registrar talleres.
- **Búsqueda en tiempo real** por nombre del taller o dirección.
- **Mapa interactivo** (Leaflet.js + OpenStreetMap) con marcadores geolocalizados para cada actividad.
- **Registro de usuarios** (*colaboradores*) con validación de campos en el cliente.
- **Gestión de talleres autenticada**: creación y eliminación de talleres propios.
- **Sección personal** "Mis Talleres" para que cada colaborador administre sus publicaciones.
- **Geocodificación automática** de direcciones mediante la API USIG del Gobierno de la Ciudad de Buenos Aires.
- **Persistencia local** mediante `localStorage`; sin backend ni base de datos externa.

---

## Arquitectura y Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Maquetado | HTML5 semántico |
| Estilos | CSS3 (archivos por vista) |
| Lógica de negocio | JavaScript ES6+ (sin frameworks) |
| Mapas | [Leaflet.js](https://leafletjs.com/) v1.x (CDN) |
| Tiles cartográficos | OpenStreetMap |
| Geocodificación | API USIG — Gobierno de la Ciudad de Buenos Aires |
| Persistencia | `localStorage` del navegador |
| Hosting recomendado | Cualquier servidor HTTP estático (GitHub Pages, Netlify, Live Server, etc.) |

La aplicación sigue un patrón de **módulos JavaScript independientes** cargados secuencialmente en el HTML. Cada módulo expone funciones globales que son invocadas por `app.js` (coordinador principal) o directamente desde los atributos de evento del HTML, separando de manera correcta las diferentes funcionalidades del sistema.

---

## Estructura del Proyecto

```
CentroCultural-main/
│
├── index.html                  # Página principal (visitante / usuario autenticado)
├── registro.html               # Formulario de registro de nuevos colaboradores
├── pantallaUsuario.html        # Panel del colaborador autenticado (registrar talleres)
├── misTalleres.html            # Vista personal: talleres del usuario en sesión
│
├── app.js                      # Coordinador principal; inicializa módulos al cargar el DOM
│
├── modulos/
│   ├── autenticacion.js        # Registro, login, logout y gestión de sesión
│   ├── talleres.js             # CRUD de talleres y renderizado de tarjetas
│   ├── mapa.js                 # Inicialización de Leaflet, marcadores y geocodificación
│   ├── busqueda.js             # Filtrado en tiempo real por nombre y dirección
│   └── validaciones.js         # Funciones de validación reutilizables (email, teléfono, URL, etc.)
│
├── style.css                   # Estilos globales (index.html)
├── style-registro.css          # Estilos para registro.html
├── style-pantallaUsuario.css   # Estilos para pantallaUsuario.html
├── style-misTalleres.css       # Estilos para misTalleres.html
│
└── img/                        # Recursos gráficos (imágenes de muestra, ícono de mapa, QR)
```

---

## Módulos de la Aplicación

### `autenticacion.js`
Gestiona el ciclo de vida de la sesión del usuario. Utiliza `localStorage` con dos claves: `colaboradoresPortal` (lista de usuarios registrados) y `usuarioActivo` (objeto del usuario en sesión). Expone las funciones:

- `registrarColaborador()`: valida y persiste un nuevo colaborador.
- `iniciarSesion()`: autentica al usuario comparando credenciales en `localStorage`.
- `cerrarSesion()`: elimina la clave `usuarioActivo` y redirige al inicio.
- `actualizarNav()`: modifica dinámicamente el menú de navegación según el estado de sesión.
- `mostrarUsuario()`: inyecta el nombre del colaborador activo en el encabezado.

### `talleres.js`
Administra la entidad central del sistema. Los talleres se almacenan en `localStorage` bajo la clave `talleres`. Expone:

- `registrarTaller()`: valida los campos del formulario, realiza geocodificación asíncrona y persiste el nuevo taller.
- `eliminarTaller(idTaller)`: verifica autoría y elimina el taller del almacenamiento.
- `mostrarTalleresDisponibles()`: renderiza todos los talleres en `index.html`.
- `mostrarMisTalleres()`: renderiza únicamente los talleres del colaborador activo en `misTalleres.html`.
- `crearMarcador()` / `crearTarjeta()`: renderizan la representación visual de cada taller en mapa y lista respectivamente, con interacción bidireccional (clic en tarjeta → centra mapa; clic en marcador → resalta tarjeta).

### `mapa.js`
Encapsula la integración con Leaflet.js y la API de geocodificación de USIG. Expone:

- `inicializarMapa()`: crea la instancia del mapa centrada en las coordenadas de la zona UNGS (`-34.5431, -58.7126`).
- `obtenerCoordenadas(direccion)`: consulta de forma asíncrona la API de USIG y retorna `{ lat, lng }` o `null` si la dirección no puede normalizarse.
- `limpiarMarcadores()`: elimina del mapa todos los marcadores activos antes de re-renderizar.

### `busqueda.js`
Implementa el filtrado en tiempo real sobre la lista de talleres visible:

- `inicializarBuscador()`: adjunta el listener de evento `input` al campo de búsqueda.
- `filtrarTalleres()`: itera sobre las tarjetas del DOM y los marcadores del mapa, mostrando u ocultando cada elemento según si el texto ingresado coincide con el nombre o la dirección del taller.

### `validaciones.js`
Biblioteca de funciones de validación. Incluye validadores de formato (`esEmail`, `esTelefono`, `esUrl`, `esContraseniaValida`) y de campo (`validarNombre`, `validarDescripcion`, `validarDireccion`, etc.). Cada función de campo retorna un objeto `{ valido: Boolean, error: String }`.

---

## Flujos de Usuario

### Usuario visitante (no autenticado)

```
Accede a index.html
  └─> Visualiza listado de talleres registrados
  └─> Busca por nombre o dirección (filtrado en tiempo real)
  └─> Interactúa con el mapa (clic en marcador → resalta tarjeta)
  └─> Puede registrarse como colaborador (→ registro.html)
  └─> Puede iniciar sesión desde el formulario en index.html
```

### Usuario colaborador (autenticado)

```
Inicia sesión en index.html → redirigido a pantallaUsuario.html
  └─> Registra un nuevo taller (con geocodificación automática de la dirección)
  └─> Accede a "Mis Talleres" (→ misTalleres.html)
      └─> Visualiza sus talleres en lista y mapa
      └─> Busca entre sus propios talleres
      └─> Elimina un taller registrado
  └─> Visualiza todos los talleres publicados (sección "Inicio")
  └─> Cierra sesión
```

---

## Instrucciones de Despliegue y Ejecución

La aplicación es completamente estática: no requiere Node.js, Python, ni ningún servidor de aplicaciones. Sin embargo, **no puede abrirse directamente desde el sistema de archivos** (`file://`) porque las peticiones `fetch` a la API de geocodificación de USIG serán bloqueadas por la política CORS del navegador. Es necesario servirla a través de un servidor HTTP, incluso en entorno local.

---

### Opción 1 — Live Server (recomendado para desarrollo)

Requiere [Visual Studio Code](https://code.visualstudio.com/) con la extensión **Live Server** instalada.

1. Abrir la carpeta del proyecto en VS Code:
   ```
   Archivo → Abrir carpeta → CentroCultural-main/
   ```
2. Hacer clic derecho sobre `index.html` en el explorador de archivos.
3. Seleccionar **"Open with Live Server"**.
4. El navegador se abrirá automáticamente en `http://127.0.0.1:5500/index.html`.

---

### Opción 2 — GitHub Pages (despliegue en producción)

1. Subir el contenido de `CentroCultural-main/` a un repositorio público de GitHub.
2. En la configuración del repositorio, ir a **Settings → Pages**.
3. En "Source", seleccionar la rama principal (`main`) y la carpeta raíz (`/`).
4. Guardar. GitHub Pages publicará el sitio en `https://<usuario>.github.io/<repositorio>/`.

> **Nota:** GitHub Pages sirve el sitio sobre HTTPS, por lo que las peticiones a la API de USIG (también HTTPS) funcionarán correctamente sin configuración adicional.

---

### Verificación del entorno

Una vez iniciado el servidor, se recomienda verificar que los siguientes puntos funcionen correctamente:

| Funcionalidad | Indicador de éxito |
|---|---|
| Carga del mapa | Se visualiza el mapa de OpenStreetMap centrado en la zona UNGS |
| Registro de usuario | El formulario valida los campos y redirige al panel de usuario |
| Registro de taller | El formulario acepta una dirección real y la geocodifica (aparece un marcador en el mapa) |
| Búsqueda | Escribir en el campo de búsqueda filtra la lista y los marcadores del mapa en tiempo real |

---

## Dependencias Externas

| Dependencia | Versión | Propósito | Modo de carga |
|---|---|---|---|
| [Leaflet.js](https://leafletjs.com/) | Última estable | Mapas interactivos y gestión de marcadores | CDN (`unpkg.com`) |
| [OpenStreetMap](https://www.openstreetmap.org/) | — | Proveedor de tiles cartográficos | Servicio externo |
| [API USIG GCBA](https://servicios.usig.buenosaires.gob.ar/) | — | Normalización y geocodificación de direcciones | Servicio externo (fetch) |

No se utilizan gestores de paquetes (npm, yarn) ni herramientas de construcción (webpack, Vite). Todas las dependencias de terceros se cargan desde CDN en tiempo de ejecución.

---

## Consideraciones de Seguridad y Limitaciones

- **Persistencia en cliente**: los datos (usuarios y talleres) se almacenan únicamente en el `localStorage` del navegador del usuario. No existe sincronización entre dispositivos ni respaldo en servidor. Limpiar los datos del navegador elimina toda la información.
- **Contraseñas en texto plano**: las credenciales se almacenan sin cifrado en `localStorage`. Se entiende que esta implementación es adecuada para prototipos académicos, pero no es apta para producción, por lo que se contempla como aspecto a mejorar para un entorno de producción. 
- **Sin autorización en servidor**: la validación de autoría de talleres (que un usuario solo pueda eliminar los suyos) se realiza íntegramente en el cliente y puede ser eludida manipulando `localStorage`. Un sistema productivo requeriría validación en backend.
- **Geocodificación limitada al área de Buenos Aires**: la API de USIG normaliza únicamente direcciones dentro del territorio de la Ciudad Autónoma de Buenos Aires. Direcciones de otras localidades del Gran Buenos Aires o del resto del país no serán geocodificadas correctamente.
- **Compatibilidad de navegadores**: la aplicación requiere un navegador moderno compatible con ES6+, la API `fetch`, `localStorage` y `URL`. Se recomienda la versión actual de Chrome, Firefox, Edge o Safari.

---

## Contexto Académico

Este proyecto es un **prototipo funcional** desarrollado en el marco de la materia **Ingeniería de Software** de la Universidad Nacional de General Sarmiento (UNGS).

**Grupo 2 — Integrantes:** 

| Apellido y nombre |
|---|
| Rebolini, Ornella |
| Schmied, Barbara |
| Apaza, Brandon |
| Perez, Daiana |
