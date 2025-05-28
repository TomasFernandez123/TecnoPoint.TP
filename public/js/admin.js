document.addEventListener("DOMContentLoaded", async () => {
    objResgistrado = {email: "tecnopoint@gmail.com", password: "12345678"};

    const form = document.getElementById("form-login");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === objResgistrado.email && password === objResgistrado.password) {
            window.location.href = "dashboard.html";
        } else {
            alert("Email o contraseña invalido.");
        }
    });
})