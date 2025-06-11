function verificarSesion() {
    if (!sessionStorage.getItem("nombre")) {
        window.location.href = "index.html";
    }
}

const API_BASE = "https://fakestoreapi.com";

async function obtenerProductos() {
    const res = await fetch(`http://localhost:3000/api/productos`);
    return await res.json();
}

async function obtenerCategorias() {
    const res = await fetch(`${API_BASE}/products/categories`);
    return await res.json();
}

async function obtenerProductoPorId(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return await res.json();
}

async function obtenerProductosPorCategoria(cat) {
    const res = await fetch(`${API_BASE}/products/category/${cat}`);
    return await res.json();
}

function saludarUsuario(nombre) {
    document.getElementById("saludo").textContent += nombre;
}

function ocultarSpinner() {
    document.getElementById("spinner").style.display = "none";
}

function crearProductoHTML(producto) {
    return `
    <div class="col-md-6 " data-aos="fade-up">
        <div class="card mb-4">
            <img src="${producto.image}" class="card-img-top" alt="${producto.title}" style="width: 200px; height: 200px; object-fit: cover; margin: auto;">
            <div class="card-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-text" style="height: 90px; overflow: hidden; text-overflow: ellipsis;">${producto.description}</p>
                <p class="card-text"><strong>Precio: $${producto.price}</strong></p>
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <button class="agregar btn btn-primary" data-id="${producto.id}">Agregar al carrito</button>
                    <div class="input-group" style="max-width: 160px;">
                        <button class="resta btn btn-outline-secondary" type="button">-</button>
                        <input type="number" class="cantidad form-control text-center" value="1" min="1">
                        <button class="sum btn btn-outline-secondary" type="button">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
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
                    nombre: data.title,
                    precio: parseFloat(data.price),
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

document.addEventListener("DOMContentLoaded", async () => {
    verificarSesion();
    AOS.init();

    const nombre = sessionStorage.getItem("nombre");
    saludarUsuario(nombre);

    try {
        const productos = await obtenerProductos();
        const categorias = await obtenerCategorias();

        mostrarCategorias(categorias, productos);
        mostrarProductos(productos);
    } catch (e) {
        console.error("Error al cargar datos:", e);
    } finally {
        ocultarSpinner();
    }
});
