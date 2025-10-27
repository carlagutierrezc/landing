"use strict";

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

(() => {
    showToast();
})();

const showVideo = () => {
    const video = document.getElementById("demo");
    if(video){
        
    }
};