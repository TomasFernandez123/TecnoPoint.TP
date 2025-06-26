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

document.addEventListener("DOMContentLoaded", () => {
    // Aplicar el modo guardado al cargar
    const temaGuardado = localStorage.getItem("tema") || "claro";
    if (temaGuardado === "oscuro") {
        document.body.classList.add("oscuro");
    }
    // Botón para cambiar modo
    const toggleBtn = document.getElementById("toggle-tema");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("oscuro");
            const nuevoTema = document.body.classList.contains("oscuro") ? "oscuro" : "claro";
            localStorage.setItem("tema", nuevoTema);
        });
    }
});