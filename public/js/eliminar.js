document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            // Mostrar modal de confirmación
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el producto permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            })

            // Si el usuario cancela, no se envía nada
            if (!confirmacion.isConfirmed) return;

            try {
                opciones = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }

                const res = await manejadorFetch(URL_API + `/api/productos/${id}`, opciones)

                const data = await res.json();

                if (res.ok) {
                    await Swal.fire(
                        '¡Eliminado!',
                        'El producto fue eliminado correctamente.',
                        'success'
                    );
                    // Recargar o actualizar la lista
                    window.location.reload();
                } else {
                    alert(data.mensaje || "Error al eliminar el producto");
                }

            } catch (err) {
                console.error(err);
                alert("¡Ocurrió un error al eliminar!");
            }
        });
    });
});
