document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auto-completar").addEventListener("click", completar)
});

function completar() {
    document.getElementById("correo").value = "tomifer47@gmail.com";
    document.getElementById("clave").value = "123456";
}