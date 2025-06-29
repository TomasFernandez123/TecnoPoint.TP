/**
 * Script que gestiona el formulario de alta y edición de productos.
 * Detecta si se está editando o creando, valida, confirma y envía los datos al backend.
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");

    /**
     * Evento al enviar el formulario: construye el producto, adjunta imagen (si hay),
     * muestra una confirmación y realiza la petición al backend.
     */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Detectar si se trata de una edición (PUT) o un alta (POST)
        const isEdit = document.getElementById("_method")?.value === "PUT";

        const id = document.getElementById("id").value;
        
        // Crear objeto producto con los datos del formulario
        const producto = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
            precio: parseFloat(document.getElementById("precio").value),
            categoria: document.getElementById("categoria").value
        };

        let foto = document.getElementById("foto");

        // Preparar el FormData con el producto y la imagen (si existe)
        let formEnvio = new FormData();
        formEnvio.append("obj_producto", JSON.stringify(producto));
        if (foto.files.length > 0) {
            formEnvio.append("foto", foto.files[0]);
        }

        // Determinar endpoint y método
        const endpoint = isEdit ? `/api/productos/${id}` : "/api/productos";

        const opciones = {
            method: isEdit ? "PUT" : "POST",
            body: formEnvio,
        };

        // Mostrar alerta de confirmación antes de enviar
        const confirmacion = await Swal.fire({
            title: isEdit ? '¿Actualizar producto?' : '¿Agregar producto?',
            text: isEdit ? '¿Estás seguro de que deseas actualizar este producto?' : '¿Estás seguro de que deseas agregar este producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: isEdit ? 'Sí, actualizar' : 'Sí, agregar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            // Enviar solicitud al backend
            let res = await manejadorFetch(URL_API + endpoint, opciones);
            const data = await res.json();

            if (res.ok) {
                // Mostrar éxito y redirigir
                Swal.fire({
                    title: isEdit ? '¡Producto actualizado!' : '¡Producto agregado!',
                    text: isEdit ? 'El producto fue actualizado correctamente.' : 'El producto fue agregado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    timer: 3000,
                    timerProgressBar: true
                }).then(async (result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = "/admin/dashboard";
                    }
                });

            } else {
                alert(data.mensaje || "Error en la operación");
            }
        } catch (err) {
            console.error(err);
            alert("¡Ha ocurrido un ERROR al enviar el formulario!");
        }
    })
});