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
                <td>${item.precio.toFixed(2)} $</td>
                <td class="text-center">
                    <div class="cantidad-control d-flex justify-content-center align-items-center gap-1">
                        <button class="btn btn-sm btn-secondary btn-restar" data-id="${item.id}">−</button>
                        <input type="number" min="1" value="${item.cantidad}" class="form-control cantidad-input text-center" data-id="${item.id}" style="width: 60px;">
                        <button class="btn btn-sm btn-secondary btn-sumar" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>${(item.precio * item.cantidad).toFixed(2)} $</td>
                <td><button class="btn btn-danger btn-sm eliminar-item" data-id="${item.id}">Eliminar</button></td>
            </tr>
            `
        });

        document.getElementById("total").innerText = "Total: " +
            (carritoGuardado.reduce((total, item) => total + (item.precio * item.cantidad), 0)).toFixed(2) + " €";

        document.querySelectorAll(".eliminar-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.getAttribute("data-id");
                const carritoActualizado = carritoGuardado.filter(item => item.id !== itemId);
                localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
                mostrarCarrito();
            });
        });

        document.querySelectorAll(".cantidad-input").forEach(input => {
            input.addEventListener("change", () => {
                const nuevoValor = parseInt(input.value);
                const itemId = input.getAttribute("data-id");

                if (nuevoValor >= 1) {
                    const carritoModificado = carritoGuardado.map(item => {
                        if (item.id === itemId) {
                            return { ...item, cantidad: nuevoValor };
                        }
                        return item;
                    });

                    localStorage.setItem("carrito", JSON.stringify(carritoModificado));
                    mostrarCarrito();
                }
            });
        });

        // Botón +
        document.querySelectorAll(".btn-sumar").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.getAttribute("data-id");
                const carritoModificado = carritoGuardado.map(item => {
                    if (item.id === itemId) {
                        return { ...item, cantidad: item.cantidad + 1 };
                    }
                    return item;
                });

                localStorage.setItem("carrito", JSON.stringify(carritoModificado));
                mostrarCarrito();
            });
        });

        // Botón −
        document.querySelectorAll(".btn-restar").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.getAttribute("data-id");
                const carritoModificado = carritoGuardado.map(item => {
                    if (item.id === itemId && item.cantidad > 1) {
                        return { ...item, cantidad: item.cantidad - 1 };
                    }
                    return item;
                });

                localStorage.setItem("carrito", JSON.stringify(carritoModificado));
                mostrarCarrito();
            });
        });

    } else {
        contenedorCarrito.innerHTML = "<tr><td colspan='5' class='text-center'>El carrito está vacío</td></tr>";
        document.getElementById("total").innerText = "Total: 0.00 $";
    }
}


function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}
