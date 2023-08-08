// Import des fichiers nécessaires
import Recipes from "./recipesFactory.js";
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