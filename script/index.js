// Import des fichiers nécessaires
import firstUppercase from "./utils.js";
import Recipes from "./factories/recipesFactory.js";
import Tag from "./factories/tagsFactory.js";
import FilterOption from "./factories/filtersOptionsFactory.js";
import recipes from "../recipes.js";


// Elements du DOM
const recipesContainer = document.querySelector( '.recipes_container' );
const optionsSelectedContainer = document.querySelector( '.options_selected_container' );


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

// Remplissage dynamique des filtres
const ingredientsOptions = document.querySelector( '#listbox1 .list_options' );
const appliancesOptions = document.querySelector( '#listbox2 .list_options' );
const ustensilsOptions = document.querySelector( '#listbox3 .list_options' );
const allIngredients = getAllIngredients();
const allAppliance = getAllAppliance();
const allUstensils = getAllUstensils();

for (let i = 0; i < allIngredients.length; i++) {
    const ingredient = new FilterOption(allIngredients[i]).getFilterOptionDOM();
    ingredient.setAttribute("id", `listbox1-${i}`);
    ingredientsOptions.appendChild(ingredient);
}
for (let i = 0; i < allAppliance.length; i++) {
    const appliance = new FilterOption(allAppliance[i]).getFilterOptionDOM();
    appliance.setAttribute("id", `listbox2-${i}`);
    appliancesOptions.appendChild(appliance);
}
for (let i = 0; i < allUstensils.length; i++) {
    const ustensil = new FilterOption(allUstensils[i]).getFilterOptionDOM();
    ustensil.setAttribute("id", `listbox3-${i}`);
    ustensilsOptions.appendChild(ustensil);
}

function getAllIngredients() {
    let allIngredients = [];
    for (let i = 0; i < recipes.length; i++) {
        const ingredients = recipes[i].ingredients;
        for (let j = 0; j < ingredients.length; j++) {
            let ingredient = firstUppercase(ingredients[j].ingredient);

            if (!allIngredients.includes(ingredient)) {
                allIngredients.push(ingredient);
            }
        }
    }
    return allIngredients.sort();
}
function getAllAppliance() {
    let allAppliance = [];
    for (let i = 0; i < recipes.length; i++) {
        let appliance = firstUppercase(recipes[i].appliance);
        if (!allAppliance.includes(appliance)) {
            allAppliance.push(appliance);
        }
    }
    return allAppliance.sort();
}
function getAllUstensils() {
    let allUstensils = [];
    for (let i = 0; i < recipes.length; i++) {
        const ustensils = recipes[i].ustensils;
        for (let j = 0; j < ustensils.length; j++) {
            let ustensil = firstUppercase(ustensils[j]);
            if (!allUstensils.includes(ustensil)) {
                allUstensils.push(ustensil);
            }
        }
    }
    return allUstensils.sort();
}

// Selection et suppression d'un tag
for (let i = 1; i < filters.length +1; i++) {
    let optionsFilter = document.querySelectorAll( `#listbox${i} li`);
    for (let j = 0; j < optionsFilter.length; j++) {
        optionsFilter[j].addEventListener("click", () => {
            const selected = new Tag(optionsFilter[j]).getTagDOM();        
            optionsSelectedContainer.appendChild(selected);
            openButtonFilter[i-1].checked = false;
            selected.addEventListener("click", () => {
                optionsSelectedContainer.removeChild(selected);
            })
        })
    }
}


/************* GESTION DE LA BARRE DE RECHERCHE PRINCIPALE **************/
