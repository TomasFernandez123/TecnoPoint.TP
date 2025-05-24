document.addEventListener("DOMContentLoaded", function() { 
    document.getElementById("form-nombre").addEventListener("submit", function(event) {
        event.preventDefault();

        localStorage.clear();

        const nombre = document.getElementById("nombre").value;

        if(nombre) {
            localStorage.setItem("nombre", nombre);
            window.location.href = `productos.html`;
        }
    })
})