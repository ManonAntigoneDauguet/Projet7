class Recipes {
    constructor(data) {
        this._name = data.name;
        this._img = data.image;
        this._imgSrc = `./images/photos_recettes/${this._img}`;
        this._time = data.time;
        this._description = data.description;
        this._ingredients = data.ingredients;
        this._id = data.id;
    }

    getIngredientListDOM() {
        const ingredientsList = document.querySelector( `.card${this._id} .ingredients-list` );

        for (let i = 0; i < this._ingredients.length; i++) {
            const ingredientCard = document.createElement( 'div' );
            ingredientCard.classList.add( 'col-12' );
            ingredientCard.classList.add( 'col-sm-6' );

            const ingredientName = document.createElement( 'p' );
            ingredientName.classList.add( 'ingredient' );
            ingredientName.classList.add( 'm-0' );
            ingredientName.innerText = this._ingredients[i].ingredient;

            const ingredientQuantity = document.createElement( 'p' );
            ingredientQuantity.classList.add( 'text-muted' );

            if (this._ingredients[i].quantity && this._ingredients[i].unit) {
                ingredientQuantity.innerText = `${this._ingredients[i].quantity} ${this._ingredients[i].unit}`;
            } else if (this._ingredients[i].quantity) {
                ingredientQuantity.innerText = this._ingredients[i].quantity;
            }

            ingredientCard.appendChild(ingredientName);
            ingredientCard.appendChild(ingredientQuantity);
            ingredientsList.appendChild(ingredientCard);
        }      
    }

    getCardDOM() {
        const card = document.createElement( 'div' );
        card.classList.add( 'card_container' );

        const content = `
            <div class="card card${this._id}">
                <img src="${this._imgSrc}" class="card-img-top" alt="${this._name}">
                <div class="card-body">
                <div class="recipe-time">${this._time}min</div>
                <h5 class="card-title mb-0">${this._name}</h5>
                <div>
                    <h6 class="card-subtitle mb-3 text-muted text-uppercase">Recette</h6>
                    <p class="description card-text">${this._description}</p>                  
                </div>
                <div>
                    <h6 class="card-subtitle mb-3 text-muted text-uppercase">Ingrédients</h6>
                    <div class="ingredients-list card-text d-flex flex-row flex-wrap">    
                    </div>
                </div>
                </div>
            </div>
        `
        card.innerHTML = content;


        return card;
    }
}

export default Recipes;