function verificarSesion() {
    if (!sessionStorage.getItem("nombre")) {
        window.location.href = "index.html";
    }
}

const API_BASE = "http://localhost:3000";

async function obtenerProductos() {
    const res = await fetch(`${API_BASE}/api/productos`);
    return await res.json();
}

async function obtenerProductoPorId(id) {
    const res = await fetch(`${API_BASE}/api/productos/${id}`);
    return await res.json();
}

async function obtenerProductosPorCategoria(cat) {
    const res = await obtenerProductos();

    const resFiltrados = res.filter(p => p.categoria === cat);
    return await resFiltrados;
}

function saludarUsuario(nombre) {
    document.getElementById("saludo").textContent += nombre;
}

function ocultarSpinner() {
    document.getElementById("spinner").style.display = "none";
}

function crearProductoHTML(producto) {
    return `
    <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
        <div class="card h-100 shadow rounded-4 border-0">
            <div class="text-center p-3">
                <img src="${API_BASE + '/' + producto.path}" class="img-fluid rounded-3" alt="${producto.nombre}"
                    style="width: 200px; height: 200px; object-fit: cover;">
            </div>

            <div class="card-body d-flex flex-column justify-content-between px-4 pb-4">
                <div>
                    <h5 class="card-title fw-bold text-primary">${producto.nombre}</h5>
                    <p class="card-text text-secondary" style="height: 90px; overflow: hidden; text-overflow: ellipsis;">
                    ${producto.descripcion}
                    </p>
                    <p class="card-text mt-2"><strong>Precio: $${producto.precio}</strong></p>
                </div>
                <div class="d-flex flex-column gap-2 mt-3">
                    <button class="agregar btn btn-primary w-100" data-id="${producto.id}">Agregar al carrito</button>
                    <div class="input-group">
                        <button class="resta btn btn-outline-secondary" type="button">-</button>
                        <input type="number" class="cantidad form-control text-center" value="1" min="1">
                        <button class="sum btn btn-outline-secondary" type="button">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = productos.map(crearProductoHTML).join('');
    agregarEventos();
}

function mostrarCategorias(categorias, todosLosProductos) {
    const contenedor = document.getElementById("categorias");
    contenedor.innerHTML = '';

    const crearBoton = (texto, clase = "btn btn-outline-secondary") => {
        const btn = document.createElement("button");
        btn.textContent = texto;
        btn.className = clase;
        return btn;
    };

    const btnTodos = crearBoton("Todos", "btn btn-outline-primary");
    marcarActivo(btnTodos);
    btnTodos.addEventListener("click", () => {
        mostrarProductos(todosLosProductos);
        marcarActivo(btnTodos);
    });
    contenedor.appendChild(btnTodos);

    categorias.forEach(cat => {
        const btn = crearBoton(capitalizar(cat));
        btn.addEventListener("click", async () => {
            try {
                const productosCat = await obtenerProductosPorCategoria(cat);
                mostrarProductos(productosCat);
                marcarActivo(btn);
            } catch (e) {
                alert("Error al cargar categoría");
            }
        });
        contenedor.appendChild(btn);
    });
}

function marcarActivo(btnSeleccionado) {
    document.querySelectorAll("#categorias button").forEach(btn => btn.classList.remove("active"));
    btnSeleccionado.classList.add("active");
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function agregarEventos() {
    document.querySelectorAll(".sum").forEach(btn =>
        btn.addEventListener("click", () => {
            const input = btn.closest(".input-group").querySelector(".cantidad");
            input.value = parseInt(input.value) + 1;
        })
    );

    document.querySelectorAll(".resta").forEach(btn =>
        btn.addEventListener("click", () => {
            const input = btn.closest(".input-group").querySelector(".cantidad");
            input.value = Math.max(1, parseInt(input.value) - 1);
        })
    );

    document.querySelectorAll(".agregar").forEach(btn =>
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const input = btn.parentElement.querySelector(".cantidad");
            const cantidad = parseInt(input.value);

            try {
                const data = await obtenerProductoPorId(id);
                agregarAlCarrito({
                    id: data.id.toString(),
                    nombre: data.nombre,
                    precio: parseFloat(data.precio),
                    cantidad
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Agregado!',
                    text: 'El producto fue añadido al carrito.',
                    showConfirmButton: false,
                    timer: 1000
                });
            } catch (e) {
                console.error("Error al agregar producto:", e);
            }
        })
    );
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

verificarSesion();
document.addEventListener("DOMContentLoaded", async () => {
    AOS.init();

    const nombre = sessionStorage.getItem("nombre");
    saludarUsuario(nombre);

    try {
        const productos = await obtenerProductos();
        const categorias = ["Tecnología","Accesorios"];

        mostrarCategorias(categorias, productos);
        mostrarProductos(productos);
    } catch (e) {
        console.error("Error al cargar datos:", e);
    } finally {
        ocultarSpinner();
    }
});
