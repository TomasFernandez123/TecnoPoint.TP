if (!sessionStorage.getItem("nombre")) {
    window.location.href = "index.html";
}

/**
 * Evento al cargar el DOM: muestra el carrito y asigna eventos a botones principales.
 */
document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
    document.getElementById("generarTicket").addEventListener("click", finalizarCompra);
});


/**
 * Muestra los productos almacenados en el carrito y su total.
 * Si está vacío, muestra un mensaje.
 */
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

/**
 * Asigna eventos a los botones de eliminar, sumar, restar y modificar cantidad.
 * @param {Array} carrito - Lista de productos en el carrito.
 */
function asignarEventos(carrito) {
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nuevoCarrito = carrito.filter(item => item.id !== id);
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            mostrarCarrito();
        });
    });

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

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

/**
 * Finaliza la compra actual validando que haya productos
 * y armando el objeto venta para enviarlo al backend.
 */
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

    venta = {
        nombre: sessionStorage.getItem("nombre"),
        productos: []
    }

    carrito.forEach(producto => {
        venta.productos.push({ id: producto.id, cantidad: producto.cantidad });
    });

    registrarVenta(venta);
}

/**
 * Envía la venta al backend y redirige al ticket si es exitosa.
 * @param {Object} obj - Objeto con los datos de la venta.
 */
async function registrarVenta(obj) {
    try {
        const respuesta = await fetch('/ventas/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada!',
                text: `ID de venta: ${data.ventaId}`,
                timer: 2000,
                willClose: () => {
                    window.location.href = 'ticket.html';
                }
            });
        }

    } catch (error) {
        console.error('Error al conectar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Fallo de conexión',
            text: 'No se pudo conectar con el servidor'
        });
    }
}

