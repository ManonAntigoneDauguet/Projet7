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

const openButtonFilter1 = document.getElementById( 'filter1-checkbox' );
const openButtonFilter2 = document.getElementById( 'filter2-checkbox' );
const openButtonFilter3 = document.getElementById( 'filter3-checkbox' );
const openButtonFilter = [openButtonFilter1, openButtonFilter2, openButtonFilter3];

const ingredientsOptions = document.querySelector( '#listbox1 .list_options' );
const appliancesOptions = document.querySelector( '#listbox2 .list_options' );
const ustensilsOptions = document.querySelector( '#listbox3 .list_options' );


// Création des cartes recettes (fonction)
function displayRecipes(array) {
    recipesContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const recipe = new Recipes(recipes[i]);
        const recipeCard = recipe.getCardDOM();
        recipesContainer.appendChild(recipeCard);
        recipe.getIngredientListDOM();
    } 
    updateTotalRecipes(array);
}


// Mise à jour du nombre total de recette (fonction)
function updateTotalRecipes(array) {
    document.querySelector( '.total_recipes' ).innerText = `${array.length} recettes`;
}


// Création des tags (fonction)
function addTag(optionSelected) {
    const selected = new Tag(optionSelected).getTagDOM();        
    optionsSelectedContainer.appendChild(selected);
    selected.addEventListener("click", () => {
        optionsSelectedContainer.removeChild(selected);
        filterRecipesWithTags();
    })
}


/**************** INITIALISATION DE LA PAGE ********************/
// Affichage dynamique des cartes recettes
displayRecipes(recipes);

// Remplissage dynamique des filtres
let allIngredients = getAllIngredients(recipes);
let allAppliance = getAllAppliance(recipes);
let allUstensils = getAllUstensils(recipes);
displayOptionsFilter(allIngredients, 1);
displayOptionsFilter(allAppliance, 2);
displayOptionsFilter(allUstensils, 3);



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

// Remplissage dynamique des filtres (fonctions)
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
        option.addEventListener("click", () => {
            addTag(option);
            openButtonFilter[filterNumber-1].checked = false;
            filterRecipesWithTags();
        })
    }   
}

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

// Mise à jour des filtres selon les recettes disponibles (fonction)
function filterOptionsAvailable(array) {
    ingredientsOptions.innerHTML = "";
    allIngredients = getAllIngredients(array);
    displayOptionsFilter(allIngredients, 1);
    appliancesOptions.innerHTML = "";
    allAppliance = getAllAppliance(array);
    displayOptionsFilter(allAppliance, 2);
    ustensilsOptions.innerHTML = "";
    allUstensils = getAllUstensils(array);
    displayOptionsFilter(allUstensils, 3);    
}



/*************** GESTION DES BARRES DE RECHERCHE ****************/
for (let i = 0; i < searchInputs.length; i++) {
    searchInputs[i].addEventListener("submit", (event) => {
        event.preventDefault();
    })
    searchInputs[i].addEventListener("keydown", () => { 
    // appliquer à d'autres évennements, comme focus, onpaste...
        if (searchInputs[i].value.trim().length+1 >= 3) {
            filterRecipesWithSearch(); // algorithme de recherche
        }
        openEraseButton(searchInputs[i]);
    })
}

// Selection rapide d'un tag parmis les options disponibles
[searchFilter1, searchFilter2, searchFilter3].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        console.log(input.value + event.key);
        filterOptionsWithSearch(input, (input.value + event.key));
    })
})

// Ajout d'un bouton "effacer" (fonction)
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



/*************** ALGORITHMES DE RECHERCHE ****************/
function filterRecipesWithTags() {
// Filtre les recettes selon les tags sélectionnés
// Appelée lors de l'jaout de la suppression d'un tag
// S'il n'y aucune recette qui correspond, alors affichage du messsage d'erreur    
    const allTags = document.querySelectorAll( '.option_selected');
    for (let i = 0; i < allTags.length; i++) {
        // console.log(allTags[i].innerText);
    }

    // test
    if (allTags.length != 0) {
        let filteredRecipes = recipes.filter((recipes) => {
            return recipes.id <= 5; // algorithme de recherche
        })
        displayRecipes(filteredRecipes);
        filterOptionsAvailable(filteredRecipes);        
    } else {
        displayRecipes(recipes);
        filterOptionsAvailable(recipes);
    }

}


function filterRecipesWithSearch(inputValue) {
// Filtre les recettes selon la recherche effectuée dans la barre principale
// Appelée par un event sur la barre principale
// S'il n'y aucune recette qui correspond, alors affichage du messsage d'erreur    

}


function filterOptionsWithSearch(input, inputValue) {
    // Filtre les options qui correspondent aux entrées de l'utilisateur dans chaque filtre
    // Appelée par un event sur la barre de recherche du filtre associé
        let optionsFiltered = [];
        let optionsAvailable;
        let optionsAvailableContener;
        let filterNumber;
        switch (input) {
            case searchFilter1:
                optionsAvailable = allIngredients;
                optionsAvailableContener = ingredientsOptions;
                filterNumber = 1;
                break;
            case searchFilter2:
                optionsAvailable = allAppliance;
                optionsAvailableContener = appliancesOptions;
                filterNumber = 2;
                break;
            case searchFilter3:
                optionsAvailable = allUstensils;
                optionsAvailableContener = ustensilsOptions;
                filterNumber = 3;
                break;
        }
    
        for (let i = 0; i < optionsAvailable.length; i++) {
            if (optionsAvailable[i].includes((inputValue))) {
                optionsFiltered.push(optionsAvailable[i]);
            }
        }
        optionsAvailableContener.innerHTML = "";
        displayOptionsFilter(optionsFiltered, filterNumber);
    }