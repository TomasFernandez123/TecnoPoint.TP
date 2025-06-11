// Redirección si no hay nombre en sesión
if (!sessionStorage.getItem("nombre")) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
    document.getElementById("generarTicket").addEventListener("click", finalizarCompra);
});

// Mostrar el contenido del carrito
function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-items");
    const total = document.getElementById("total");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<tr><td colspan='5' class='text-center'>El carrito está vacío</td></tr>";
        total.textContent = "Total: 0.00 $";
        return;
    }

    contenedor.innerHTML = "";
    carrito.forEach(item => {
        contenedor.innerHTML += `
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
        `;
    });

    const totalFinal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    total.textContent = `Total: ${totalFinal.toFixed(2)} $`;

    asignarEventos(carrito);
}

// Asigna eventos a los botones dentro del carrito
function asignarEventos(carrito) {
    // Eliminar producto
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nuevoCarrito = carrito.filter(item => item.id !== id);
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            mostrarCarrito();
        });
    });

    // Cambiar cantidad manualmente
    document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("change", () => {
            const id = input.dataset.id;
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad >= 1) {
                const nuevoCarrito = carrito.map(item => {
                    if (item.id === id) {
                        return { ...item, cantidad: nuevaCantidad };
                    }
                    return item;
                });
                localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
                mostrarCarrito();
            }
        });
    });

    // Botón sumar
    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nuevoCarrito = carrito.map(item => {
                if (item.id === id) {
                    return { ...item, cantidad: item.cantidad + 1 };
                }
                return item;
            });
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            mostrarCarrito();
        });
    });

    // Botón restar
    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nuevoCarrito = carrito.map(item => {
                if (item.id === id && item.cantidad > 1) {
                    return { ...item, cantidad: item.cantidad - 1 };
                }
                return item;
            });
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            mostrarCarrito();
        });
    });
}

// Vaciar carrito
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

// Finalizar compra
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'No puedes finalizar la compra sin productos en el carrito.',
        });
        return;
    }

    window.location.href = "ticket.html";
}
