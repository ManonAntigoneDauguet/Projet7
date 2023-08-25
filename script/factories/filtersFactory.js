import { firstUppercase, transformIntoId } from "../utils.js";


class FilterComponent {
    constructor(filterId, filterSubject, searchInput, openButtonFilter, optionsContainerContainer) {
        this._id = filterId;
        this._subject = filterSubject;
        this._searchInput = searchInput;
        this._openButton = openButtonFilter;
        this._optionsContainer = optionsContainerContainer;
    }


    getAllOptions(array) {
        if (this._id == 1) {
            return this.getAllIngredients(array);
        } else if (this._id == 2) {
            return this.getAllAppliance(array);
        } else if (this._id == 3) {
            return this.getAllUstensils(array);
        }
    }  

    getFilterOptionDOM(option) {
        const optionDOM = document.createElement( 'li' );
        optionDOM.classList.add( 'list-group-item' );
        optionDOM.setAttribute("id", transformIntoId(option));
        optionDOM.innerText = option;
        return optionDOM;
    }


    // Récupération des options selon les recettes disponibles et le filtre concerné
    getAllIngredients(array) {
        let allIngredients = [];
        for (let i = 0; i < array.length; i++) {
            try {
                const ingredients = array[i].ingredients;
                for (let j = 0; j < ingredients.length; j++) {
                    let ingredient = firstUppercase(ingredients[j].ingredient);
                    if (!allIngredients.includes(ingredient)) {
                        allIngredients.push(ingredient);
                    }
                }                
            } catch (error) {
                allIngredients = Array.from(array);
            }
        }
        return allIngredients.sort();
    }

    getAllAppliance(array) {
        let allAppliance = [];
        for (let i = 0; i < array.length; i++) {
            try {
                let appliance = firstUppercase(array[i].appliance);
                if (!allAppliance.includes(appliance)) {
                    allAppliance.push(appliance);
                }                
            } catch (error) {
                allAppliance = Array.from(array);
            }
        }
        return allAppliance.sort();
    }
    
    getAllUstensils(array) {
        let allUstensils = [];
        for (let i = 0; i < array.length; i++) {
            try {
                const ustensils = array[i].ustensils;
                for (let j = 0; j < ustensils.length; j++) {
                    let ustensil = firstUppercase(ustensils[j]);
                    if (!allUstensils.includes(ustensil)) {
                        allUstensils.push(ustensil);
                    }
                }                
            } catch (error) {
                allUstensils = Array.from(array);
            }
        }
        return allUstensils.sort();
    }
}

export default FilterComponent;