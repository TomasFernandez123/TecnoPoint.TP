/**
 * Al cargar el DOM, inicializa animaciones, verifica sesión del usuario
 * y muestra los productos disponibles.
 */
document.addEventListener("DOMContentLoaded", async () => {
    AOS.init();
    verificarSesion();

    const nombre = sessionStorage.getItem("nombre");
    saludarUsuario(nombre);
    listarProductos();
});

/**
 * Lista productos paginados por categoría, muestra la UI y la paginación.
 * @param {number} [page=1] - Número de página actual.
 */
async function listarProductos(page = 1) {
    try {
        const productosRep = await obtenerProductosPaginados(page, categoriaSeleccionada);
        const productos = productosRep.productos;;
        const categorias = ["Tecnología", "Accesorios"];

        mostrarCategorias(categorias, productos);
        mostrarProductos(productos);

        const totalPaginas = productosRep.paginasTotales;
        crearBotonesPaginacion(page, totalPaginas);
        document.getElementById("paginaActual").textContent = page;
    } catch (e) {
        console.error("Error al cargar datos:", e);
    } finally {
        ocultarSpinner();
    }
}

/**
 * Crea los botones de paginación y asigna eventos para cambiar de página.
 * @param {number} paginaActual - Página actual.
 * @param {number} totalPaginas - Cantidad total de páginas.
 */
function crearBotonesPaginacion(paginaActual, totalPaginas) {
    const contenedor = document.getElementById("paginacion");
    contenedor.innerHTML = `
        <button id="btnAnterior" class="btn btn-outline-primary" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
        <span class="mx-2 fw-semibold">Página ${paginaActual}</span>
        <button id="btnSiguiente" class="btn btn-outline-primary" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
    `;

    document.getElementById("btnAnterior").addEventListener("click", () => {
        if (paginaActual > 1) listarProductos(paginaActual - 1);
    });

    document.getElementById("btnSiguiente").addEventListener("click", () => {
        if (paginaActual < totalPaginas) listarProductos(paginaActual + 1);
    });
}

/**
 * Genera el HTML de una tarjeta de producto.
 * @param {Object} producto - Objeto producto.
 * @returns {string} - HTML generado del producto.
 */
function crearProductoHTML(producto) {
    return `
    <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
        <div class="card h-100 shadow rounded-4 border-0">
            <div class="text-center p-3">
                <img src="${API_BASE + '/' + producto.path}" class="img-fluid rounded-3" alt="${producto.nombre}"
                    style="width: 250px; height: 250px; object-fit: cover;">
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
                    <button onclick="eliminarDelCarrito('${producto.id}')" class="btn btn-danger w-100">🗑 Eliminar del carrito</button>
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

/**
 * Muestra los productos en el contenedor principal.
 * @param {Array} productos - Lista de productos.
 */
function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = productos.map(crearProductoHTML).join('');
    agregarEventos();
}

/**
 * Muestra los botones de categorías y permite filtrado.
 * @param {Array} categorias - Lista de nombres de categoría.
 * @param {Array} productosActuales - Productos actuales para mostrar.
 */
function mostrarCategorias(categorias, productosActuales) {
    const contenedor = document.getElementById("categorias");
    contenedor.innerHTML = '';

    const crearBoton = (texto, clase = "btn btn-outline-secondary") => {
        const btn = document.createElement("button");
        btn.textContent = texto;
        btn.className = clase;
        return btn;
    };

    const btnTodos = crearBoton("Todos", "btn btn-outline-primary");
    if (!categoriaSeleccionada) marcarActivo(btnTodos);

    btnTodos.addEventListener("click", () => {
        categoriaSeleccionada = null;
        listarProductos(1);
        marcarActivo(btnTodos);
    });
    contenedor.appendChild(btnTodos);

    categorias.forEach(cat => {
        const btn = crearBoton(capitalizar(cat));
        if (categoriaSeleccionada === cat) marcarActivo(btn);

        btn.addEventListener("click", () => {
            categoriaSeleccionada = cat;
            listarProductos(1);
            marcarActivo(btn);
        });
        contenedor.appendChild(btn);
    });
}

/**
 * Marca un botón de categoría como activo.
 * @param {HTMLElement} btnSeleccionado - Botón seleccionado.
 */
function marcarActivo(btnSeleccionado) {
    document.querySelectorAll("#categorias button").forEach(btn => btn.classList.remove("active"));
    btnSeleccionado.classList.add("active");
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Agrega eventos a botones: sumar, restar, agregar al carrito.
 */
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

/**
 * Agrega un producto al carrito y lo guarda en localStorage.
 * @param {Object} producto - Producto a agregar.
 */
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

/**
 * Elimina un producto del carrito por ID.
 * @param {string} idProducto - ID del producto a eliminar.
 */
function eliminarDelCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existente = carrito.find(item => item.id === idProducto);
    if (existente) {
        carrito = carrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El producto fue eliminado del carrito.',
            showConfirmButton: false,
            timer: 1000
        });
    }
}

/**
 * Obtiene productos activos de la API en formato paginado.
 * @param {number} pagina - Número de página.
 * @param {string|null} [categoria=null] - Categoría a filtrar.
 * @returns {Promise<Object>} - Productos paginados.
 */
async function obtenerProductosPaginados(pagina, categoria = null) {
    let url = `${API_BASE}/api/productos/activos/page?pagina=${pagina}&limite=6`;
    if (categoria) {
        url += `&categoria=${encodeURIComponent(categoria)}`;
    }

    const res = await fetch(url);
    return await res.json();
}

/**
 * Obtiene los datos de un producto por su ID.
 * @param {string|number} id - ID del producto.
 * @returns {Promise<Object>} - Objeto del producto.
 */
async function obtenerProductoPorId(id) {
    const res = await fetch(`${API_BASE}/api/productos/${id}`);
    return await res.json();
}

function saludarUsuario(nombre) {
    document.getElementById("saludo").textContent += nombre;
}

function ocultarSpinner() {
    document.getElementById("spinner").style.display = "none";
}

function verificarSesion() {
    if (!sessionStorage.getItem("nombre")) {
        window.location.href = "index.html";
    }
}

// Variables globales
const API_BASE = "http://localhost:3000";

let categoriaSeleccionada = null;