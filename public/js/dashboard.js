document.addEventListener("DOMContentLoaded", async () => {
    //Eliminar el localStorage al cargar la página
    localStorage.removeItem("idProducto");

    try {
        const resProductos = await fetch('https://fakestoreapi.com/products');
        const productos = await resProductos.json();

        mostrarProductos(productos);

    } catch (err) {
        console.log("Error al cargar datos:", err);
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
            const fila = e.target.closest("tr");
            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                if (fila) {
                    fila.remove();
                    alert("Producto eliminado correctamente.");
                } else {
                    alert("Error al eliminar el producto.");
                }
            }
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