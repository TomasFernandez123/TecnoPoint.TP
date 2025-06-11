if (sessionStorage.getItem("admin") !== "activo") {
    window.location.href = "admin.html";
}
document.addEventListener("DOMContentLoaded", async () => {


    try {
        const resProductos = await fetch('https://fakestoreapi.com/products');
        const productos = await resProductos.json();

        mostrarProductos(productos);

    } catch (err) {
        console.log("Error al cargar datos:", err);
    } finally {
        document.getElementById("spinner").style.display = "none";
    }
});

function mostrarProductos(productos) {
    const contenedor = document.getElementById("lista-productos");

    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const fila = document.createElement("tr");
        fila.classList.add("align-middle");
        fila.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.title}</td>
        <td>$${producto.price.toFixed(2)}</td>
        <td> <img src="${producto.image}" alt="Imagen del producto" style="width: 50px;"> </td>
        <td>
            <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-danger btn-sm eliminar-producto" data-id="${producto.id}">Eliminar</button>
                <button class="btn btn-warning btn-sm modificar-producto" data-id="${producto.id}">Modificar</button>    
            </div>
        </td>
      `;
        contenedor.appendChild(fila);
    });

    agregarEventos();
}

function agregarEventos() {
    const btnEliminar = document.querySelectorAll(".eliminar-producto");
    const btnModificar = document.querySelectorAll(".modificar-producto");

    btnEliminar.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // Evitar comportamiento no deseado

            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el producto permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const idProducto = e.target.getAttribute("data-id");

                    try {
                        const res = await fetch(`https://fakestoreapi.com/${idProducto}`, {
                            method: 'DELETE',
                        });

                        // if (!res.ok) {
                        //     throw new Error("No se pudo eliminar el producto.");
                        // }

                        // Eliminar la fila de la tabla
                        const fila = e.target.closest("tr");
                        if (fila) {
                            fila.remove();
                        }

                        // Mostrar mensaje de éxito
                        await Swal.fire(
                            '¡Eliminado!',
                            'El producto fue eliminado correctamente.',
                            'success'
                        );

                    } catch (err) {
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar el producto. Intenta nuevamente.',
                            'error'
                        );
                    }
                }
            });
        });
    });

    btnModificar.forEach(btn => {
        btn.addEventListener("click", (e) => {
            window.location.href = "modificar.html";
            const idProducto = e.target.getAttribute("data-id");
            localStorage.setItem("idProducto", idProducto);
        });
    });
}