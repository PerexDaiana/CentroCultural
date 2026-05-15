// ===== MÓDULO DE VALIDACIONES =====
// Funciones para validar tipos de datos, formatos y campos obligatorios

// ===== VALIDADORES BÁSICOS =====

function esEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function esSoloLetras(texto) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(texto.trim());
}

function esSoloNumeros(texto) {
    const regex = /^[0-9]+$/;
    return regex.test(texto.trim());
}

function esTelefono(telefono) {
    // Acepta: 1234567890, 12-3456-7890, +54 9 11 1234-5678
    const regex = /^[\d\s\-\+()]+$/;
    return regex.test(telefono.trim()) && telefono.replace(/\D/g, '').length >= 10;
}

function esUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function esContraseniaValida(contrasenia) {
    // Al menos 6 caracteres, 1 mayúscula, 1 número
    const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(contrasenia);
}

function noEstaVacio(valor) {
    return valor && valor.trim().length > 0;
}

// ===== VALIDADORES DE CAMPOS ESPECÍFICOS =====

function validarNombre(nombre) {
    if (!noEstaVacio(nombre)) {
        return { valido: false, error: "El nombre es obligatorio" };
    }
    if (!esSoloLetras(nombre)) {
        return { valido: false, error: "El nombre solo debe contener letras" };
    }
    if (nombre.trim().length < 2) {
        return { valido: false, error: "El nombre debe tener al menos 2 caracteres" };
    }
    return { valido: true };
}

function validarApellido(apellido) {
    if (!noEstaVacio(apellido)) {
        return { valido: false, error: "El apellido es obligatorio" };
    }
    if (!esSoloLetras(apellido)) {
        return { valido: false, error: "El apellido solo debe contener letras" };
    }
    if (apellido.trim().length < 2) {
        return { valido: false, error: "El apellido debe tener al menos 2 caracteres" };
    }
    return { valido: true };
}

function validarEmail(email) {
    if (!noEstaVacio(email)) {
        return { valido: false, error: "El email es obligatorio" };
    }
    if (!esEmail(email)) {
        return { valido: false, error: "El email no es válido (ej: usuario@ejemplo.com)" };
    }
    return { valido: true };
}

function validarTelefono(telefono) {
    if (!noEstaVacio(telefono)) {
        return { valido: false, error: "El teléfono es obligatorio" };
    }
    if (!esTelefono(telefono)) {
        return { valido: false, error: "El teléfono no es válido (10 dígitos mínimo)" };
    }
    return { valido: true };
}

function validarContrasenia(contrasenia) {
    if (!noEstaVacio(contrasenia)) {
        return { valido: false, error: "La contraseña es obligatoria" };
    }
    if (!esContraseniaValida(contrasenia)) {
        return { valido: false, error: "La contraseña debe tener: 6+ caracteres, 1 mayúscula, 1 número" };
    }
    return { valido: true };
}

function validarNombreTaller(nombre) {
    if (!noEstaVacio(nombre)) {
        return { valido: false, error: "El nombre del taller es obligatorio" };
    }
    if (nombre.trim().length < 3) {
        return { valido: false, error: "El nombre debe tener al menos 3 caracteres" };
    }
    return { valido: true };
}

function validarDescripcion(descripcion) {
    if (!noEstaVacio(descripcion)) {
        return { valido: false, error: "La descripción es obligatoria" };
    }
    if (descripcion.trim().length < 10) {
        return { valido: false, error: "La descripción debe tener al menos 10 caracteres" };
    }
    return { valido: true };
}

function validarRubro(rubro) {
    if (!noEstaVacio(rubro)) {
        return { valido: false, error: "El rubro es obligatorio" };
    }
    return { valido: true };
}

function validarDireccion(direccion) {
    if (!noEstaVacio(direccion)) {
        return { valido: false, error: "La dirección es obligatoria" };
    }
    // Validar formato: Calle Nro, Localidad
    const regex = /^.+\s\d+.*,\s*.+$/;
    if (!regex.test(direccion)) {
        return { valido: false, error: "Formato: Calle 123, Localidad" };
    }
    return { valido: true };
}

function validarUrl(url) {
    // Opcional, pero si se completa debe ser válida
    if (noEstaVacio(url) && !esUrl(url)) {
        return { valido: false, error: "La URL no es válida" };
    }
    return { valido: true };
}

// ===== FUNCIÓN GENÉRICA DE VALIDACIÓN =====

function mostrarError(elementId, mensaje) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.classList.add("campo-error");
        elemento.title = mensaje;
        
        // Crear o actualizar span de error
        let spanError = elemento.nextElementSibling;
        if (!spanError || !spanError.classList.contains("error-msg")) {
            spanError = document.createElement("span");
            spanError.classList.add("error-msg");
            elemento.parentNode.insertBefore(spanError, elemento.nextSibling);
        }
        spanError.textContent = mensaje;
    }
}

function limpiarError(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.classList.remove("campo-error");
        elemento.title = "";
        
        const spanError = elemento.nextElementSibling;
        if (spanError && spanError.classList.contains("error-msg")) {
            spanError.remove();
        }
    }
}
