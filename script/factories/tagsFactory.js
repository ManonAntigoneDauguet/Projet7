class Tag {
    constructor(optionSelected, filterComponentObject) {
        this._option = optionSelected;
        this._filter = filterComponentObject._subject;
    }

    getTagDOM() {
        const selected = document.createElement( 'div' );
        selected.classList.add( 'col-md-2' );
        selected.classList.add( 'tag' );
        selected.classList.add( 'mb-3' );
        selected.classList.add( 'bg-warning' );
        selected.classList.add( 'position-relative' );
        const content = `
            <span class="option_selected" name="${this._filter}_tag">${this._option.innerText}</span>
            <img src="./images/icons/close_icon.svg" height="10px" alt="supprimer" class="close_icon">
            <img src="./images/icons/active_close_icon.svg" height="17px" alt="supprimer" class="active_close_icon">
        `
        selected.innerHTML = content;

        return selected;
    }
}

export default Tag;