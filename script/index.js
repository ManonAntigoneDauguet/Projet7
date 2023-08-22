// Import des fichiers nécessaires
import firstUppercase from "./utils.js";
import Recipes from "./factories/recipesFactory.js";
import Tag from "./factories/tagsFactory.js";
import FilterOption from "./factories/filtersOptionsFactory.js";
import recipes from "../recipes.js";


// Elements du DOM
const recipesContainer = document.querySelector( '.recipes_container' );
const optionsSelectedContainer = document.querySelector( '.options_selected_container' );

const searchMain = document.getElementById( 'search' );
const searchFilter1 = document.getElementById( 'search1' );
const searchFilter2 = document.getElementById( 'search2' );
const searchFilter3 = document.getElementById( 'search3' );
const searchInputs = [searchMain, searchFilter1, searchFilter2, searchFilter3];

const filter1 = document.getElementById ( 'listbox1' );
const openButtonFilter1 = document.getElementById( 'filter1-checkbox' );
const filter2 = document.getElementById ( 'listbox2' );
const openButtonFilter2 = document.getElementById( 'filter2-checkbox' );
const filter3 = document.getElementById ( 'listbox3' );
const openButtonFilter3 = document.getElementById( 'filter3-checkbox' );
const filters = [filter1, filter2, filter3];
const openButtonFilter = [openButtonFilter1, openButtonFilter2, openButtonFilter3];

const ingredientsOptions = document.querySelector( '#listbox1 .list_options' );
const appliancesOptions = document.querySelector( '#listbox2 .list_options' );
const ustensilsOptions = document.querySelector( '#listbox3 .list_options' );


// Création des cartes recettes
function displayRecipes(array) {
    recipesContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const recipe = new Recipes(recipes[i]);
        const recipeCard = recipe.getCardDOM();
        recipesContainer.appendChild(recipeCard);
        recipe.getIngredientListDOM();
    } 
}
displayRecipes(recipes);


// Création des tags
function addTag(optionSelected) {
    const selected = new Tag(optionSelected).getTagDOM();        
    optionsSelectedContainer.appendChild(selected);
    selected.addEventListener("click", () => {
        optionsSelectedContainer.removeChild(selected);
        recipesFilterSort();
    })
}


/******************* GESTION DES FILTRES **********************/
// Comportement d'affichage des filtres
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
let allIngredients = getAllIngredients(recipes);
let allAppliance = getAllAppliance(recipes);
let allUstensils = getAllUstensils(recipes);

function displayOptionsFilter(array, filterNumber) {
    for (let i = 0; i < array.length; i++) {
        const option = new FilterOption(array[i]).getFilterOptionDOM();
        switch (filterNumber) {
            case 1:
                option.setAttribute("id", `listbox1-${i}`);
                ingredientsOptions.appendChild(option);
                break;
            case 2:
                option.setAttribute("id", `listbox2-${i}`);
                appliancesOptions.appendChild(option);
                break;
            case 3:
                option.setAttribute("id", `listbox3-${i}`);
                ustensilsOptions.appendChild(option);
                break;
        }
    }   
}
displayOptionsFilter(allIngredients, 1);
displayOptionsFilter(allAppliance, 2);
displayOptionsFilter(allUstensils, 3);

function getAllIngredients(array) {
    let allIngredients = [];
    for (let i = 0; i < array.length; i++) {
        const ingredients = array[i].ingredients;
        for (let j = 0; j < ingredients.length; j++) {
            let ingredient = firstUppercase(ingredients[j].ingredient);
            if (!allIngredients.includes(ingredient)) {
                allIngredients.push(ingredient);
            }
        }
    }
    return allIngredients.sort();
}
function getAllAppliance(array) {
    let allAppliance = [];
    for (let i = 0; i < array.length; i++) {
        let appliance = firstUppercase(array[i].appliance);
        if (!allAppliance.includes(appliance)) {
            allAppliance.push(appliance);
        }
    }
    return allAppliance.sort();
}
function getAllUstensils(array) {
    let allUstensils = [];
    for (let i = 0; i < array.length; i++) {
        const ustensils = array[i].ustensils;
        for (let j = 0; j < ustensils.length; j++) {
            let ustensil = firstUppercase(ustensils[j]);
            if (!allUstensils.includes(ustensil)) {
                allUstensils.push(ustensil);
            }
        }
    }
    return allUstensils.sort();
}

optionsSort(recipes)

/*************** GESTION DES BARRES DE RECHERCHE ****************/
for (let i = 0; i < searchInputs.length; i++) {
    searchInputs[i].addEventListener("submit", (event) => {
        event.preventDefault();
    })
    searchInputs[i].addEventListener("keydown", () => { 
    // appliquer à d'autres évennements, comme focus, onpaste...
        if (searchInputs[i].value.trim().length+1 >= 3) {
            console.log("algo");
            // algorithme de recherche
        }
        openEraseButton(searchInputs[i]);
    })
}

function openEraseButton(input) {
    const eraseButton = document.querySelector( `.form_${input.id} .close_button`);
    if (input.value.length == null || input.value.length == "") {
        eraseButton.style.display = "none";
    } else {
        eraseButton.style.display = "block";
    } 
    eraseButton.addEventListener("click", () => {
        input.value = null;
        eraseButton.style.display = "none";
    })
}


/*************** FONCTIONS DE FILTRES ****************/
async function recipesFilterSort() {
    // appelée pour filtrer les recettes selon les tags séléctionnés.
    // S'il n'y aucune recette qui correspond, alors affichage du messsage d'erreur
    const allTags = document.querySelectorAll( '.option_selected');
    for (let i = 0; i < allTags.length; i++) {
        console.log(allTags[i].innerText);
    }

    // test
    if (allTags.length != 0) {
        let filteredRecipes = recipes.filter((recipes) => {
            return recipes.id <= 5;
        })
        displayRecipes(filteredRecipes);
        optionsSort(filteredRecipes);        
    } else {
        displayRecipes(recipes);
        optionsSort(recipes);
    }

}

function recipesSearchSort() {
    // appelée pour filtrer les recettes selon la recherche effectuée dans la barre principale
}

function optionsSort(array) {
    // appelée pour mettre à jour les options de filtres possibles selon les recettes restantes
    ingredientsOptions.innerHTML = "";
    allIngredients = getAllIngredients(array);
    displayOptionsFilter(allIngredients, 1);
    appliancesOptions.innerHTML = "";
    allAppliance = getAllAppliance(array);
    displayOptionsFilter(allAppliance, 2);
    ustensilsOptions.innerHTML = "";
    allUstensils = getAllUstensils(array);
    displayOptionsFilter(allUstensils, 3);    

    for (let i = 1; i < filters.length +1; i++) {
        let optionsFilter = document.querySelectorAll( `#listbox${i} li`);
        for (let j = 0; j < optionsFilter.length; j++) {
            optionsFilter[j].addEventListener("click", () => {
                addTag(optionsFilter[j]);
                openButtonFilter[i-1].checked = false;
                recipesFilterSort();
            })
        }
    }
}