// Import des fichiers nécessaires
import firstUppercase from "./utils.js";
import Recipes from "./factories/recipesFactory.js";
import Tag from "./factories/tagsFactory.js";
import FilterComponent from "./factories/filtersFactory.js";
import recipes from "../recipes.js";


// Elements du DOM
const recipesContainer = document.querySelector( '.recipes_container' );
const optionsSelectedContainer = document.querySelector( '.options_selected_container' );

const form0 = document.querySelector( 'form[name="form_search"]');
const form1 = document.querySelector( 'form[name="form_search1"]');
const form2 = document.querySelector( 'form[name="form_search2"]');
const form3 = document.querySelector( 'form[name="form_search3"]');
const forms = [form0, form1, form2, form3];

const searchMain = document.getElementById( 'search' );
const searchFilter1 = document.getElementById( 'search1' );
const searchFilter2 = document.getElementById( 'search2' );
const searchFilter3 = document.getElementById( 'search3' );

const openButtonFilter1 = document.getElementById( 'filter1-checkbox' );
const openButtonFilter2 = document.getElementById( 'filter2-checkbox' );
const openButtonFilter3 = document.getElementById( 'filter3-checkbox' );

const ingredientsOptionsContainer = document.querySelector( '#listbox1 .list_options' );
const appliancesOptionsContainer = document.querySelector( '#listbox2 .list_options' );
const ustensilsOptionsContainer = document.querySelector( '#listbox3 .list_options' );


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
let filteredRecipes = Array.from(recipes);


// Création des objets filtres
let filterComponent1 = new FilterComponent(1, "ingredients", searchFilter1, openButtonFilter1, ingredientsOptionsContainer);
let filterComponent2 = new FilterComponent(2, "appliances", searchFilter2, openButtonFilter2, appliancesOptionsContainer);
let filterComponent3 = new FilterComponent(3, "ustensils", searchFilter3, openButtonFilter3, ustensilsOptionsContainer);
let filterComponents = [filterComponent1, filterComponent2, filterComponent3];


// Affichage dynamique des filtres
for (let i = 0; i < filterComponents.length; i++) {
    displayOptionsFilter(filterComponents[i], recipes);
}



/******************* GESTION DES FILTRES **********************/
// Comportement d'affichage des filtres
for (let i = 0; i < filterComponents.length; i++) {
    filterComponents[i]._openButton.addEventListener("change", () => {
        if (filterComponents[i]._openButton.checked) {
            document.querySelector( `label[for="${filterComponents[i]._openButton.id}"] .chevron`).setAttribute("alt", "refermer");
        }        
        else {
            document.querySelector( `label[for="${filterComponents[i]._openButton.id}"] .chevron`).setAttribute("alt", "etendre");
        }  
    })
}


// Remplissage dynamique des filtres (fonctions)
function displayOptionsFilter(filterComponentObject, array) {
    filterComponentObject._optionsContainer.innerHTML = "";
    const allOptions = filterComponentObject.getAllOptions(array);

    for (let i = 0; i < allOptions.length; i++) {
        const option = filterComponentObject.getFilterOptionDOM(allOptions[i]);
        filterComponentObject._optionsContainer.appendChild(option);
        option.addEventListener("click", () => {
            addTag(option);
            filterComponentObject._openButton.checked = false;
            filterRecipesWithTags();
            console.log(`filtrer par "${option.innerText}"`);
        })
    }   
}



/*************** GESTION DES BARRES DE RECHERCHE ****************/
// Gestion de la barre principale de recherche
form0.addEventListener("submit", (event) => {
    event.preventDefault();
})  

searchMain.addEventListener("keydown", () => { 
    // appliquer à d'autres évennements, comme focus, onpaste...
    if (searchMain.value.trim().length+1 >= 3) {
        filterRecipesWithSearch(); // algorithme de recherche
    }
    openEraseButton(searchMain);
});


// Gestion des barres de recherches associées aux objects filtres
for (let i = 0; i < filterComponents.length; i++) {
    let input = filterComponents[i]._searchInput;
    let form = forms[i+1];

    input.addEventListener("keydown", () => {
        console.log(input.value);
        filterOptionsWithSearch(filterComponents[i], input.value);
        openEraseButton(input, filterComponents[i]);
    })

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (filterComponents[i]._optionsContainer.firstChild) {
            console.log(filterComponents[i]._optionsContainer.firstChild)
            addTag(filterComponents[i]._optionsContainer.firstChild);
            filterComponents[i]._openButton.checked = false;
            filterRecipesWithTags();
        }        
    })
}

// Ajout d'un bouton "effacer" (fonction)
function openEraseButton(input, filterComponentObject = undefined) {
    const eraseButton = document.querySelector( `form[name="form_${input.id}"] .close_button`);
    if (input.value.length == null || input.value.length == "") {
        eraseButton.style.display = "none";
    } else {
        eraseButton.style.display = "block";
    } 
    eraseButton.addEventListener("click", () => {
        input.value = null;
        eraseButton.style.display = "none";
        if (filterComponentObject != undefined) {
            displayOptionsFilter(filterComponentObject, filteredRecipes);
        }
    })
}



/*************** ALGORITHMES DE RECHERCHE ****************/
function filterRecipesWithTags() {
    // Filtre les recettes selon les tags sélectionnés
    // Appelée lors de l'ajout ou de la suppression d'un tag
    // S'il n'y aucune recette qui correspond, alors affichage du messsage d'erreur    
    const allTags = document.querySelectorAll( '.option_selected');
    for (let i = 0; i < allTags.length; i++) {
        // console.log(allTags[i].innerText);
    }

    if (allTags.length != 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
            return recipe.id <= 5; // algorithme de recherche
        })
        displayRecipes(filteredRecipes);
        for (let i = 0; i < filterComponents.length; i++) {
            displayOptionsFilter(filterComponents[i], filteredRecipes)  
        }
    } else {
        filteredRecipes = Array.from(recipes);
        displayRecipes(recipes);
        for (let i = 0; i < filterComponents.length; i++) {
            displayOptionsFilter(filterComponents[i], recipes)   
        }
    }
}


function filterRecipesWithSearch(inputValue) {
    // Filtre les recettes selon la recherche effectuée dans la barre principale
    // Appelée par un event sur la barre principale
    // S'il n'y aucune recette qui correspond, alors affichage du messsage d'erreur   

}


function filterOptionsWithSearch(filterComponentObject, inputValue) {
    // Filtre les options qui correspondent aux entrées de l'utilisateur dans chaque filtre
    // Appelée par un event sur la barre de recherche du filtre associé
    let optionsFiltered = [];
    let optionsAvailable = filterComponentObject.getAllOptions(filteredRecipes);
    
    for (let i = 0; i < optionsAvailable.length; i++) {
        if (optionsAvailable[i].includes((inputValue))) {
            optionsFiltered.push(optionsAvailable[i]);
        }
    }  
    displayOptionsFilter(filterComponentObject, optionsFiltered);
}