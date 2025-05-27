document.addEventListener("DOMContentLoaded", async () => {
    AOS.init();

    const nombre = localStorage.getItem("nombre");
    document.getElementById("saludo").textContent += nombre;

    try {
        const resProductos = await fetch('https://fakestoreapi.com/products');
        const productos = await resProductos.json();

        const resCategorias = await fetch('https://fakestoreapi.com/products/categories');
        const categorias = await resCategorias.json();

        mostrarCategorias(categorias, productos);
        mostrarProductos(productos);

    } catch (err) {
        console.log("Error al cargar datos:", err);
    } finally {
        document.getElementById("spinner").style.display = "none";
    }
})

function mostrarProductos(json) {
    const contenedor = document.getElementById("productos");

    contenedor.innerHTML = "";

    json.forEach(producto => {
        contenedor.innerHTML +=
            `
        <div class="col-md-6 " data-aos="fade-up">
            <div class="card mb-4">
                <img src="${producto.image}" class="card-img-top" alt="${producto.title}" style="width: 200px; height: 200px; object-fit: cover; margin: auto;">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text" style="height: 90px; overflow: hidden; text-overflow: ellipsis;">${producto.description}</p>
                    <p class="card-text"><strong>Precio: ${producto.price}</strong></p>
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
        </div>
        `
    })

    agregarEventos();
}

function mostrarCategorias(categorias, productos) {
    const contenedor = document.getElementById("categorias");
    // Botón "Todos"
    const btnTodos = document.createElement("button");
    btnTodos.textContent = "Todos";
    btnTodos.className = "btn btn-outline-primary";
    btnTodos.addEventListener("click", () => {
        mostrarProductos(productos);
        marcarActivo(btnTodos);
    });
    contenedor.appendChild(btnTodos);

    // Botones por categoría
    categorias.forEach(categoria => {
        const btn = document.createElement("button");
        btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        btn.className = "btn btn-outline-secondary";
        btn.addEventListener("click", async () => {
            try {
                const res = await fetch(`https://fakestoreapi.com/products/category/${categoria}`);
                const filtrados = await res.json();
                marcarActivo(btn);
                mostrarProductos(filtrados);
            } catch (error) {
                alert("Error al cargar categoría:", error);
            }
        });
        contenedor.appendChild(btn);
    });

}

function marcarActivo(botonClickeado) {
    const botones = document.querySelectorAll("#categorias button");
    botones.forEach(btn => btn.classList.remove("active"));
    botonClickeado.classList.add("active");
}

// Agregar funcionalidad a los botones de suma y resta
function agregarEventos() {
    const sumaButtons = document.querySelectorAll(".sum");
    const restaButtons = document.querySelectorAll(".resta");
    const cantidadInputs = document.querySelectorAll(".cantidad");

    sumaButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            let cantidad = parseInt(cantidadInputs[index].value);
            cantidadInputs[index].value = cantidad + 1;
        });
    });

    restaButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            let cantidad = parseInt(cantidadInputs[index].value);
            if (cantidad > 1) {
                cantidadInputs[index].value = cantidad - 1;
            }
        });
    });

    document.querySelectorAll(".agregar").forEach(btn => {
        btn.addEventListener("click", async () => {
            const idProducto = btn.getAttribute("data-id");

            const cantidad = btn.parentElement.querySelector(".cantidad").value;

            try {
                const res = await fetch(`https://fakestoreapi.com/products/${idProducto}`);
                const data = await res.json(); 

                const producto = {
                    id: data.id.toString(),
                    nombre: data.title,
                    cantidad: parseInt(cantidad),
                    precio: parseFloat(data.price)
                };

                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

                const productoExistente = carrito.find(item => item.id == producto.id);
                if (productoExistente) {
                    productoExistente.cantidad += producto.cantidad;
                } else {
                    carrito.push(producto);
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));

                Swal.fire({
                    icon: 'success',
                    title: '¡Agregado!',
                    text: 'El producto fue añadido al carrito.',
                    showConfirmButton: false,
                    timer: 1000
                });
            } catch (error) {
                console.error("Error al obtener la cantidad:", error);
            }


        })
    })
}

