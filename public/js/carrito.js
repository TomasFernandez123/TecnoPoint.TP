document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito)
})

function mostrarCarrito() {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    const contenedorCarrito = document.getElementById("carrito-items");
    
    if (carritoGuardado && carritoGuardado.length > 0) {
        contenedorCarrito.innerHTML = "";

        carritoGuardado.forEach(item => {
            contenedorCarrito.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.precio.toFixed(2)} €</td>
                <td>${item.cantidad}</td>
                <td>${(item.precio * item.cantidad).toFixed(2)} €</td>
                <td><button class="btn btn-danger btn-sm eliminar-item" data-id="${item.id}">Eliminar</button></td>
            </tr>
            `
        });
        document.getElementById("total").innerText = "Total: " +  (carritoGuardado.reduce((total, item) => total + (item.precio * item.cantidad), 0)).toFixed(2) + " €";

        document.querySelectorAll(".eliminar-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.getAttribute("data-id");
                const carritoActualizado = carritoGuardado.filter(item => item.id !== itemId);
                localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
                mostrarCarrito();
            })
        })

    } else {
        contenedorCarrito.innerHTML = "<tr><td colspan='5' class='text-center'>El carrito está vacío</td></tr>";
        document.getElementById("total").innerText = "Total: 0.00 €";
    }
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}
