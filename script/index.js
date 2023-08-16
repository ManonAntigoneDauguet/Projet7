// Import des fichiers nécessaires
import Recipes from "./recipesFactory.js";
import Tag from "./tagsFactory.js";
import recipes from "../recipes.js";


// Elements du DOM
const recipesContainer = document.querySelector( '.recipes_container' );


// Création des cartes recettes
for (let i = 0; i < recipes.length; i++) {
    const recipe = new Recipes(recipes[i]);
    const recipeCard = recipe.getCardDOM();
    recipesContainer.appendChild(recipeCard);
    recipe.getIngredientListDOM();
}


/******************* GESTION DES FILTRES **********************/
// Comportement d'affichage des filtres
const filter1 = document.getElementById ( 'listbox1' );
const openButtonFilter1 = document.getElementById( 'filter1-checkbox' );
const filter2 = document.getElementById ( 'listbox2' );
const openButtonFilter2 = document.getElementById( 'filter2-checkbox' );
const filter3 = document.getElementById ( 'listbox3' );
const openButtonFilter3 = document.getElementById( 'filter3-checkbox' );
const filters = [filter1, filter2, filter3];
const openButtonFilter = [openButtonFilter1, openButtonFilter2, openButtonFilter3];

for (let i = 0; i < openButtonFilter.length; i++) {
    openButtonFilter[i].addEventListener("change", () => {
        if (openButtonFilter[i].checked) {
            document.querySelector( `label[for="${openButtonFilter[i].id}"] .chevron`).setAttribute("alt", "refermer");
        }        
        if (!openButtonFilter[i].checked) {
            document.querySelector( `label[for="${openButtonFilter[i].id}"] .chevron`).setAttribute("alt", "etendre");
        }  
    })
}

// Selection et suppression d'un tag
const optionsSelectedContainer = document.querySelector( '.options_selected_container' );
for (let i = 1; i < filters.length +1; i++) {
    let optionsFilter = document.querySelectorAll( `#listbox${i} li`);
    for (let j = 0; j < optionsFilter.length; j++) {
        optionsFilter[j].addEventListener("click", () => {
            const selected = new Tag(optionsFilter[j]).getTagDOM();        
            optionsSelectedContainer.appendChild(selected);
            openButtonFilter[i-1].checked = false;
            // openTagControle();
            selected.addEventListener("click", () => {
                optionsSelectedContainer.removeChild(selected);
            })
        })
    }
}