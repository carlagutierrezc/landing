"use strict";

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

/**
 * Muestra el toast interactivo, si existe en el DOM.
 *
 * No recibe parámetros: la función busca el elemento con id `toast-interactive`
 * y, de encontrarlo, añade la clase `md:block` para hacerlo visible en pantallas
 * medianas o mayores (según utilidades responsive de Tailwind).
 * @returns {void} No retorna ningún valor.
 */

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Registra el comportamiento del botón de demo en video.
 * No recibe parámetros: la función localiza el elemento con id `demo` y, si existe,
 * agrega un listener para abrir la URL del video en una pestaña nueva al hacer clic. 
 * @returns {void} No retorna ningún valor.
 * @listens click
 */

const showVideo = () => {
    const video = document.getElementById("demo");
    if(video){
        video.addEventListener('click', () => {
            window.open("https://youtu.be/1lke4HP4j8o?si=jLzaUFV9AfA11tmz", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
})();