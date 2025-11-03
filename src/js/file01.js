"use strict";

import { fetchProducts, fetchCategories } from "./functions.js";

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

/**
 * Carga los productos desde la API y los renderiza como tarjetas dentro del
 * contenedor con id "products-container". Limpia el contenido anterior,
 * toma los primeros 6 elementos y concatena cada tarjeta con `innerHTML +=`.
 *
 * @returns {void} No retorna ningún valor; produce efectos en el DOM.
 * @see https://dev.to/goaqidev/jsdoc-la-guia-definitiva-para-documentar-tu-codigo-javascript-ik5
 * @example
 * // Al inicializar la página:
 * renderProducts();
 *
 * // Resultado: el contenedor #products-container mostrará 6 tarjetas de producto.
 */

const renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
    .then(result => {
        if(result.success){
            const container = document.getElementById("products-container");
            container.innerHTML = "";

            const products = result.body.slice(0,6);
            products.forEach(product => {
                let productHTML = `
                    <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                        <img
                            class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                            src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                        <h3
                            class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                            $[PRODUCT.PRICE]
                        </h3>

                        <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                            <div class="space-y-2">
                                <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                    Ver en Amazon
                                </a>
                                <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                            </div>
                        </div>
                    </div>`;
                productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title);
                productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);
                productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl);
                productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price);
                productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL);
                container.innerHTML += productHTML;
            });
            
        } else {
            alert(result.body);
        }
    })
}

/**
 * Obtiene el XML de categorías y llena el <select id="categories"> con
 * una opción por defecto más una opción por cada <category>. Usa `await`,
 * `try/catch`, y `innerHTML +=` para concatenar las opciones.
 *
 * @async
 * @returns {void} No retorna ningún valor; produce efectos en el DOM.
 * @see https://dev.to/goaqidev/jsdoc-la-guia-definitiva-para-documentar-tu-codigo-javascript-ik5
 * @example
 * // Al inicializar la página:
 * await renderCategories();
 *
 * // Resultado: el <select id="categories"> mostrará la lista proveniente del XML.
 */

const renderCategories = async () => {
    try {
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');
        if (result.success){
            const container = document.getElementById('categories');
            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;
            const categoriesXML = result.body;
            const categories = categoriesXML.getElementsByTagName('category');
            for (let category of categories) {
                let categoryHTML = `<option value="[ID]">[NAME]</option>`;
                const idNode = category.getElementsByTagName('id').item(0);
                const nameNode = category.getElementsByTagName('name').item(0);
                const id = idNode.textContent;
                const name = nameNode.textContent;
                categoryHTML = categoryHTML.replaceAll("[ID]", id);
                categoryHTML = categoryHTML.replaceAll("[NAME]", name);
                container.innerHTML += categoryHTML;
            }
        } else {
            alert(result.body);
        }
    } catch (error) {
        alert(error.message);
    }
}

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
})();