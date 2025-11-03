"use strict";

import { fetchProducts, fetchCategories } from "./functions.js";
import { saveVote, getVotes } from "./firebase.js";

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

/**
 * Habilita el formulario de votación
 * @function
 * @description Configura el event listener para el formulario de votación
 */
const enableForm = () => {
  const form = document.getElementById('form_voting');
  
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const selectProduct = document.getElementById('select_product');
      const productID = selectProduct.value;

      if (!productID) {
        alert('Por favor, selecciona un producto para votar.');
        return;
      }
      
      try {
        const result = await saveVote(productID);
        
        if (result.success) {
          alert(result.message);
          form.reset();
          await displayVotes();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Ocurrió un error inesperado al guardar el voto.');
      }
    });
  }
};

/**
 * Muestra los votos en una tabla HTML
 * @function
 * @async
 * @description Obtiene los votos de Firebase y los muestra en una tabla
 */
const displayVotes = async () => {
  try {
    const result = await getVotes();
    const container = document.getElementById('results');
    
    if (!result.success) {
      container.innerHTML = `<p class="text-red-500">Error: ${result.message}</p>`;
      return;
    }
    
    const votes = result.data;

    if (Object.keys(votes).length === 0) {
      container.innerHTML = `
        <div class="text-center p-4 bg-gray-100 rounded-lg">
          <p class="text-gray-600">No hay votos registrados todavía.</p>
        </div>
      `;
      return;
    }

    const voteCounts = {};
    Object.values(votes).forEach(vote => {
      if (!voteCounts[vote.productID]) {
        voteCounts[vote.productID] = 0;
      }
      voteCounts[vote.productID]++;
    });

    let tableHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead class="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Producto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total de Votos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Porcentaje
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
    `;
    
    const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
    
    const sortedProducts = Object.entries(voteCounts)
      .sort(([,a], [,b]) => b - a);
    
    sortedProducts.forEach(([productID, count]) => {
      const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
      
      tableHTML += `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            ${productID}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            ${count}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            ${percentage}%
          </td>
        </tr>
      `;
    });
    
    tableHTML += `
          </tbody>
          <tfoot class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                TOTAL
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                ${totalVotes}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
    
    container.innerHTML = tableHTML;
    
  } catch (error) {
    console.error('Error mostrando votos:', error);
    const container = document.getElementById('results');
    container.innerHTML = `
      <div class="text-red-500 p-4 bg-red-50 rounded-lg">
        Error al cargar los votos: ${error.message}
      </div>
    `;
  }
};

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
    enableForm();
    displayVotes();
})();