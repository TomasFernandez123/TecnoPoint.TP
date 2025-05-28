document.addEventListener('DOMContentLoaded', async () => {
    const idProducto = localStorage.getItem('idProducto');

    if (!idProducto) {
        alert('No se encontró el ID del producto. Por favor, vuelve a la página anterior.');
        window.location.href = 'dashboard.html';
        return;
    }

    try {
        const resProducto = await fetch(`https://fakestoreapi.com/products/${idProducto}`);

        if (!resProducto.ok) {
            throw new Error('Error al obtener el producto');
        }

        const producto = await resProducto.json();

        document.getElementById('id').value = producto.id;
        document.getElementById('nombre').value = producto.title;
        document.getElementById('precio').value = producto.price;
        document.getElementById('descripcion').value = producto.description;
        document.getElementById('foto').value = producto.image;

    } catch (error) {
        console.error('Error al cargar el producto:', error);
        alert('Error al cargar el producto. Por favor, intenta nuevamente.');
        window.location.href = 'dashboard.html';
    }

    
})