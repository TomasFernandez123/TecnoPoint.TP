if (sessionStorage.getItem("admin") !== "activo") {
    window.location.href = "admin.html";
}
document.addEventListener('DOMContentLoaded', async () => {
    const idProducto = localStorage.getItem('idProducto');


    if (!idProducto) {
        window.location.href = 'dashboard.html';
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

    document.getElementById('form-modificar').addEventListener('submit', async (e) => {

        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const descripcion = document.getElementById('descripcion').value;
        const foto = document.getElementById('foto').value;

        if (!id || !nombre || isNaN(precio) || !descripcion || !foto) {
            Swal.fire('Campos incompletos', 'Por favor, completa todos los campos correctamente.', 'warning');
            return;
        }

        // Mostrar modal de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Guardar cambios?',
            text: 'Se actualizará la información del producto.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario cancela, no se envía nada
        if (!confirmacion.isConfirmed) return;

        try {
            const resModificar = await fetch(`https://fakestoreapi.com/products/${idProducto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: nombre,
                    price: precio,
                    description: descripcion,
                    image: foto
                })
            });

            if (!resModificar.ok) {
                throw new Error('Error al modificar el producto');
            }

            await Swal.fire('¡Modificado!', 'Los cambios se guardaron correctamente.', 'success');

            localStorage.removeItem("idProducto");
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Error al modificar el producto:', error);
            Swal.fire('Error', 'No se pudo modificar el producto. Intenta nuevamente.', 'error');
        }
    });

})