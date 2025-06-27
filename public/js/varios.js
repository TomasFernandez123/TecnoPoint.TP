const URL_API = "http://localhost:3000"; 

const manejadorFetch = async (url, options) => {
    return await fetch(url, options)
        .then(manejadorError);
};

const manejadorError = (res) => {
    if ( ! res.ok)
    {
        throw new Error(res.statusText);
    } 

    return res;
};

function fail(retorno) {
    console.error(retorno);
    alert("¡Ha ocurrido un ERROR!!!");
}

function success() {
    mostrarListadoFotos();
    limpiarForm();
}

function limpiarForm() {
    document.getElementById("img_foto").src = "";
    document.getElementById("div_foto").style.display = "none";
    document.getElementById("codigo").readOnly = false;
    document.getElementById("codigo").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("foto").value = "";
}

function cambiarTema() {
    const btnModo = document.getElementById("toggle-tema");

    const temaGuardado = localStorage.getItem('tema') || 'light';
    document.documentElement.setAttribute('data-bs-theme', temaGuardado);
    btnModo.textContent = temaGuardado === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';

    btnModo.addEventListener("click", () => {
        const html = document.documentElement;
        const temaActual = html.getAttribute("data-bs-theme");
        const nuevoTema = temaActual === "light" ? "dark" : "light";

        html.setAttribute("data-bs-theme", nuevoTema);
        btnModo.textContent = nuevoTema === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro';
        localStorage.setItem('tema', nuevoTema);
    });
}

document.addEventListener("DOMContentLoaded", cambiarTema);