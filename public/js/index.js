document.addEventListener("DOMContentLoaded", function() { 
    AOS.init();

    document.getElementById("form-nombre").addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value;

        sessionStorage.setItem("nombre", nombre);
        window.location.href = `productos.html`;
        
    })
})