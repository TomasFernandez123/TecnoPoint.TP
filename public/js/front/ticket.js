if (!sessionStorage.getItem("nombre")) {
    window.location.href = "index.html";
}

/**
 * Evento que se ejecuta al cargar el DOM.
 * Muestra los datos del ticket, fecha, hora, total de compra y configura eventos.
 */
document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const nombreCliente = sessionStorage.getItem("nombre") || "Cliente desconocido";

    document.getElementById("clienteNombre").textContent = `Nombre: ${nombreCliente}`;

    const tbody = document.getElementById("ticketBody");
    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td class="text-end">$${producto.precio.toFixed(2)}</td>
        <td class="text-center">${producto.cantidad}</td>
        <td class="text-end">$${subtotal.toFixed(2)}</td>
      `;
        tbody.appendChild(fila);
    });

    document.getElementById("totalFinal").textContent = total.toFixed(2);

    document.getElementById("salir").addEventListener("click", () => {
        localStorage.removeItem("carrito");
        sessionStorage.removeItem("nombre");
        window.location.href = "index.html";
    });

    document.getElementById("descargar").addEventListener("click", () => {
        descargarPDF(nombreCliente);
    });

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString(); 
    const hora = ahora.toLocaleTimeString();  
    
    document.getElementById("fechaActual").textContent = fecha;
    document.getElementById("horaActual").textContent = hora;
});

/**
 * Genera y descarga un PDF del ticket mostrado en pantalla.
 * @param {string} name - Nombre del cliente (usado en el nombre del archivo).
 */
function descargarPDF(name) {
  const element = document.querySelector(".card");

  const opciones = {
    margin:       0,
    filename:     'ticket - ' + name + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opciones).from(element).save();
}