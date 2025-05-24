document.addEventListener("DOMContentLoaded", (e) => {
    const nombre = localStorage.getItem("nombre");
    
    document.getElementById("saludo").textContent += nombre;
    
})