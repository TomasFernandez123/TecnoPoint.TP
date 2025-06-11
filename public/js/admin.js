document.addEventListener("DOMContentLoaded", async () => {
    
    sessionStorage.removeItem("admin");
    
    AOS.init();

    objResgistrado = {email: "tecnopoint@gmail.com", password: "12345678"};

    const form = document.getElementById("form-login");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === objResgistrado.email && password === objResgistrado.password) {
            sessionStorage.setItem("admin", "activo");
            window.location.href = "dashboard.html";
        } else {
            Swal.fire("Acceso denegado", "Usuario o contraseña incorrectos", "error");
        }
    });
})