document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-estado").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            // Mostrar modal de confirmación
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción modificara el estado del producto.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, modificar',
                cancelButtonText: 'Cancelar'
            })

            // Si el usuario cancela, no se envía nada
            if (!confirmacion.isConfirmed) return;

            try {
                opciones = {
                    method: "PUT"
                }

                const res = await manejadorFetch(URL_API + `/api/productos/estado/${id}`, opciones)

                const data = await res.json();

                if (res.ok) {
                    await Swal.fire(
                        '¡Modificado!',
                        'El producto fue modificado correctamente.',
                        'success'
                    );
                    // Recargar o actualizar la lista
                    window.location.reload();
                } else {
                    alert(data.mensaje || "Error al modificar el producto");
                }

            } catch (err) {
                console.error(err);
                alert("¡Ocurrió un error al modificar!");
            }
        });
    });
});
