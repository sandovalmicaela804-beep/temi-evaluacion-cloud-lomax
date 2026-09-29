const formulario = document.getElementById("producto-form");
const atributosContainer = document.getElementById("atributos-container");
const btnAgregarAtributo = document.getElementById("btn-agregar-atributo");

const inputImagen = document.getElementById("imagen");
const previewContainer = document.getElementById("preview-container");
const imagenPreview = document.getElementById("imagen-preview");

const mensaje = document.getElementById("mensaje");
const estadoRegistro = document.getElementById("estado-registro");


// ========================================
// AGREGAR ATRIBUTO
// ========================================

btnAgregarAtributo.addEventListener("click", function () {

    const fila = document.createElement("div");

    fila.className = "attribute-row";

    fila.innerHTML = `
        <input
            type="text"
            class="atributo-nombre"
            placeholder="Nombre del atributo"
        >

        <input
            type="text"
            class="atributo-valor"
            placeholder="Valor"
        >

        <button
            type="button"
            class="btn-remove"
            onclick="eliminarAtributo(this)"
        >
            Eliminar
        </button>
    `;

    atributosContainer.appendChild(fila);
});


// ========================================
// ELIMINAR ATRIBUTO
// ========================================

function eliminarAtributo(boton) {

    const filas = atributosContainer.querySelectorAll(".attribute-row");

    if (filas.length === 1) {
        mensaje.textContent = "Debe existir al menos un atributo.";
        return;
    }

    boton.parentElement.remove();

    mensaje.textContent = "";
}

// ========================================
// VALIDAR Y MOSTRAR IMAGEN
// ========================================

inputImagen.addEventListener("change", function () {

    const archivo = inputImagen.files[0];

    if (!archivo) {
        previewContainer.classList.add("hidden");
        return;
    }

    const tiposPermitidos = [
        "image/jpeg",
        "image/png"
    ];

    const maximoMB = 5;
    const maximoBytes = maximoMB * 1024 * 1024;


    // Validar tipo
    if (!tiposPermitidos.includes(archivo.type)) {

        mensaje.textContent =
            "La imagen debe estar en formato JPG, JPEG o PNG.";

        inputImagen.value = "";
        previewContainer.classList.add("hidden");

        return;
    }


    // Validar tamaño
    if (archivo.size > maximoBytes) {

        mensaje.textContent =
            "La imagen no puede superar los 5 MB.";

        inputImagen.value = "";
        previewContainer.classList.add("hidden");

        return;
    }


    // Todo correcto
    mensaje.textContent = "";

    const lector = new FileReader();

    lector.onload = function (evento) {

        imagenPreview.src = evento.target.result;
        previewContainer.classList.remove("hidden");
    };

    lector.readAsDataURL(archivo);
});


// ========================================
// VALIDACIÓN DEL FORMULARIO
// ========================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    // Obtener campos
    const codigoInput = document.getElementById("codigo");
    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    const precioInput = document.getElementById("precio");
    const categoriaInput = document.getElementById("categoria");

    const codigo = codigoInput.value.trim();
    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const precio = precioInput.value;
    const categoria = categoriaInput.value;
    const imagen = inputImagen.files[0];


    // Limpiar errores anteriores
    limpiarErrores();


    // ========================================
    // VALIDAR CÓDIGO
    // ========================================

    if (!codigo) {

        mostrarError(
            codigoInput,
            "Debes ingresar el código del producto."
        );

        codigoInput.focus();
        return;
    }


    // ========================================
    // VALIDAR NOMBRE
    // ========================================

    if (!nombre) {

        mostrarError(
            nombreInput,
            "Debes ingresar el nombre del producto."
        );

        nombreInput.focus();
        return;
    }


    // ========================================
    // VALIDAR PRECIO
    // ========================================

    if (!precio) {

        mostrarError(
            precioInput,
            "Debes ingresar el precio del producto."
        );

        precioInput.focus();
        return;
    }


    if (Number(precio) < 0) {

        mostrarError(
            precioInput,
            "El precio no puede ser negativo."
        );

        precioInput.focus();
        return;
    }


    // ========================================
    // VALIDAR CATEGORÍA
    // ========================================

    if (!categoria) {

        mostrarError(
            categoriaInput,
            "Debes seleccionar una categoría."
        );

        categoriaInput.focus();
        return;
    }


    // ========================================
    // VALIDAR DESCRIPCIÓN
    // ========================================

    if (!descripcion) {

        mostrarError(
            descripcionInput,
            "Debes ingresar una descripción del producto."
        );

        descripcionInput.focus();
        return;
    }


    // ========================================
    // VALIDAR IMAGEN
    // ========================================

    if (!imagen) {

        mostrarError(
            inputImagen,
            "Debes seleccionar una imagen del producto."
        );

        return;
    }


    // ========================================
    // VALIDAR ATRIBUTOS
    // ========================================

    const filasAtributos =
        atributosContainer.querySelectorAll(".attribute-row");

    for (const fila of filasAtributos) {

        const nombreAtributo =
            fila.querySelector(".atributo-nombre").value.trim();

        const valorAtributo =
            fila.querySelector(".atributo-valor").value.trim();


        if (!nombreAtributo || !valorAtributo) {

            mensaje.textContent =
                "⚠️ Completa el nombre y valor de todos los atributos.";

            fila.querySelector(
                !nombreAtributo
                    ? ".atributo-nombre"
                    : ".atributo-valor"
            ).focus();

            return;
        }
    }


    // ========================================
    // TODO CORRECTO
    // ========================================

    estadoRegistro.textContent =
        "Estado: formulario válido, listo para enviar a la API.";

    mensaje.textContent =
        "✓ Los datos del producto son válidos.";

});


// ========================================
// MOSTRAR ERROR
// ========================================

function mostrarError(campo, texto) {
    campo.classList.add("input-error");

    mensaje.textContent = "⚠️ " + texto;

    mensaje.classList.remove("hidden");
}

// ========================================
// LIMPIAR ERRORES
// ========================================

function limpiarErrores() {
    const campos = formulario.querySelectorAll("input, select, textarea");

    campos.forEach(function (campo) {
        campo.classList.remove("input-error");
    });

    mensaje.textContent = "";
    mensaje.classList.add("hidden");
}