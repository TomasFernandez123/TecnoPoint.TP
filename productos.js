document.addEventListener("DOMContentLoaded", () => {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => mostrarProductos(json))
        .catch(err => console.log(err))

})

function mostrarProductos(json) {
    const contenedor = document.getElementById("productos");
    json.forEach(producto => {
        contenedor.innerHTML += 
        `
        <div class="col-md-6">
            <div class="card mb-4">
                <img src="${producto.image}" class="card-img-top" alt="${producto.title}" style="height: 400px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text" style="height: 90px; overflow: hidden; text-overflow: ellipsis;">${producto.description}</p>
                    <p class="card-text"><strong>Precio: ${producto.price}</strong></p>
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <button class="btn btn-primary">Agregar al carrito</button>
                        <div class="input-group" style="max-width: 160px;">
                            <button class="btn btn-outline-secondary" type="button">-</button>
                            <input type="number" class="form-control text-center" value="1" min="1">
                            <button class="btn btn-outline-secondary" type="button">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        
    })
}