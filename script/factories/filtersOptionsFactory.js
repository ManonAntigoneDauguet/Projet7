class FilterOption {
    constructor(option) {
        this._option = option;
    }

    getFilterOptionDOM() {
        const optionDOM = document.createElement( 'li' );
        optionDOM.classList.add( 'list-group-item' );
        optionDOM.innerText = this._option;
        return optionDOM;
    }
}

export default FilterOption;