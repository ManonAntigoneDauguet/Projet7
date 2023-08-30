// Import des fichiers nécessaires
import { transformIntoId, firstLowerCase } from "./utils.js";
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



/**************** INITIALISATION DE LA PAGE ********************/
let filteredRecipes = Array.from(recipes);


// Création des objets filtres
let filterComponent1 = new FilterComponent(1, "ingredients", searchFilter1, openButtonFilter1, ingredientsOptionsContainer);
let filterComponent2 = new FilterComponent(2, "appliance", searchFilter2, openButtonFilter2, appliancesOptionsContainer);
let filterComponent3 = new FilterComponent(3, "ustensils", searchFilter3, openButtonFilter3, ustensilsOptionsContainer);
let filterComponents = [filterComponent1, filterComponent2, filterComponent3];


function init() {
    // Affichage dynamique des cartes recettes
    displayRecipes(filteredRecipes);
    
    // Affichage dynamique des filtres
    for (let i = 0; i < filterComponents.length; i++) {
        displayOptionsAvailable(filterComponents[i], recipes);
        filterComponents[i]._openButton.addEventListener("change", () => {
            accessibilityFilterComponent(filterComponents[i]);
        })

        // Comportement des barres de recherche des filtres
        const input = filterComponents[i]._searchInput;
        input.addEventListener("input", () => {
            openEraseButton(input, filterComponents[i]);
            searchAFilterOption(filterComponents[i], input.value);
        })
        let form = forms[i+1];
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (filterComponents[i]._optionsContainer.firstChild) {
                addTag(filterComponents[i]._optionsContainer.firstChild, filterComponents[i]);
                filterComponents[i]._openButton.checked = false;
                filterRecipesWithTags();
            }        
        })
    }

    // Comportement de la barre de recherche principale
    form0.addEventListener("submit", (event) => {
        event.preventDefault();
    }) 
    searchMain.addEventListener("input", () => {
        openEraseButton(searchMain);
        if (searchMain.value.trim().length >= 3) {
            filterRecipesWithSearch(searchMain.value.trim()); 
        } else {
            displayRecipes(filteredRecipes);
            for (let i = 0; i < filterComponents.length; i++) {
                displayOptionsAvailable(filterComponents[i], filteredRecipes)   
            }
        }
    })
}


init();



/******************* AFFICHAGE GENERAL **********************/
// Création des cartes recettes (fonction)
function displayRecipes(array) {
    recipesContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const recipe = new Recipes(array[i]);
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
function addTag(optionSelected, filterComponentObject) {
    const selected = new Tag(optionSelected, filterComponentObject).getTagDOM();      
    optionsSelectedContainer.appendChild(selected);
    selected.addEventListener("click", () => {
        optionsSelectedContainer.removeChild(selected);
        filterRecipesWithTags();
    })
}

// Création d'un message d'erreur s'il n'y aucune recette de disponible (fonction)
function addErrorMessage(inputValue) {
    const errorMessage = document.createElement( 'p' );
    errorMessage.innerHTML = `Aucune recette ne contient <span class="detail_errorMessage"></span>,<br>Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
    recipesContainer.appendChild(errorMessage);
    const detail = document.querySelector( '.detail_errorMessage' ); 
    detail.innerText = `"${inputValue}"`;
}



/******************* GESTION DES FILTRES **********************/
// Ouverture et fermeture des filtres (fonction)
function accessibilityFilterComponent(filterComponents) {
    if (filterComponents._openButton.checked) {
        document.querySelector( `label[for="${filterComponents._openButton.id}"] .chevron`).setAttribute("alt", "refermer");
    }        
    else {
        document.querySelector( `label[for="${filterComponents._openButton.id}"] .chevron`).setAttribute("alt", "etendre");
    }    
}

// Remplissage dynamique des filtres (fonction)
function displayOptionsAvailable(filterComponentObject, array) {
    filterComponentObject._optionsContainer.innerHTML = "";
    const allOptions = filterComponentObject.getAllOptions(array);

    for (let i = 0; i < allOptions.length; i++) {
        const option = filterComponentObject.getFilterOptionDOM(allOptions[i]);
        filterComponentObject._optionsContainer.appendChild(option);
        option.addEventListener("click", () => {
            addTag(option, filterComponentObject);
            filterComponentObject._openButton.checked = false;
            filterRecipesWithTags();
        })
    }   
}



/*************** GESTION DES BARRES DE RECHERCHE ****************/
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
            displayOptionsAvailable(filterComponentObject, filteredRecipes);
        } else {
            filterRecipesWithTags();
        }
    })
}

// Gestion de la barre principale de recherche (fonction)
function filterRecipesWithSearch(inputValue) {
    let newFilteredRecipes = getFilteredRecipesWithSearch(inputValue);
    displayRecipes(newFilteredRecipes);
    for (let i = 0; i < filterComponents.length; i++) {
        displayOptionsAvailable(filterComponents[i], newFilteredRecipes)  
    }
    if (newFilteredRecipes.length == 0) {
        addErrorMessage(inputValue);
    }  
} 

// Gestion des barres de recherches associées aux objects filtres (fonction)
function filterRecipesWithTags() {
    filteredRecipes = Array.from(recipes);
    const allTags = document.querySelectorAll( '.option_selected');

    if (searchMain.value.trim().length >= 3) {
        filteredRecipes = getFilteredRecipesWithSearch(searchMain.value.trim())
    }
    if (allTags.length != 0) {
        filteredRecipes = getFilteredRecipesWithTags(allTags);
    } 
    displayRecipes(filteredRecipes);
    for (let i = 0; i < filterComponents.length; i++) {
        displayOptionsAvailable(filterComponents[i], filteredRecipes)   
    }      
}



/*************** ALGORITHMES DE RECHERCHE ****************/
// Filtre les options correspondants aux entrées utilisateur (fonction)
function searchAFilterOption(filterComponentObject, inputValue) {
    let optionsFiltered = [];
    let optionsAvailable = filterComponentObject.getAllOptions(filteredRecipes);
    
    for (let i = 0; i < optionsAvailable.length; i++) {
        let optionsAvailableId = transformIntoId(optionsAvailable[i]);
        if (optionsAvailableId.includes(transformIntoId(inputValue))) {
            optionsFiltered.push(optionsAvailable[i]);
        }
    }  
    
    displayOptionsAvailable(filterComponentObject, optionsFiltered);
}

// Retourne la liste des recettes filtrées par les tags sélectionnés (fonction)
function getFilteredRecipesWithTags(allTags) {
    let newFilteredRecipes = Array.from(filteredRecipes);

    for (let i = 0; i < allTags.length; i++) {
        let tag = allTags[i].innerText;
        let finish;

        switch (allTags[i].getAttribute( 'name' )) {
            case "ingredients_tag":
                finish = false;
                while (!finish) {
                    finish = true;
                    for (let j = 0; j < newFilteredRecipes.length; j++) {
                        let kept = false;
                        let ingredientList = newFilteredRecipes[j].ingredients.map(ingredient => transformIntoId(ingredient.ingredient));
                        if (ingredientList.includes(transformIntoId(tag))) {
                            kept = true;
                        }
                        if (!kept) {
                            newFilteredRecipes.splice(j, 1);
                            finish = false;
                        }
                    }                    
                }
                break
            case "appliance_tag":
                newFilteredRecipes = newFilteredRecipes.filter((recipe) => {
                    return recipe.appliance == tag;
                })  
                break
            case "ustensils_tag":
                newFilteredRecipes = newFilteredRecipes.filter((recipe) => {
                    return recipe.ustensils.includes(firstLowerCase(tag));
                })  
                break
        }
    }
    return newFilteredRecipes;
}

// Retourne la liste des recettes filtrées par la barre principale (fonction)
// (prend en considération les tags présents)

/********** VERSION 1 ************/

function getFilteredRecipesWithSearch(inputValue) {
    console.time("timer");
    let newFilteredRecipes = Array.from(filteredRecipes);
    newFilteredRecipes = newFilteredRecipes.filter((recipe) => {
        let nameId = transformIntoId(recipe.name);
        let ingredientList = recipe.ingredients.map(ingredient => transformIntoId(ingredient.ingredient));
        let description = transformIntoId(recipe.description);
        let filteredRecipe;
        let ingredientIncluded = false;

        ingredientList.forEach((ingredient) => {
            if (ingredient.includes(transformIntoId(inputValue))) {
                ingredientIncluded = true;
            }
        })

        if (description.includes(transformIntoId(inputValue))
            || nameId.includes(transformIntoId(inputValue))
            || ingredientIncluded) {
            filteredRecipe = recipe;
        }
        return filteredRecipe;
    })
    console.timeEnd("timer");
    return [...new Set(newFilteredRecipes)];
}