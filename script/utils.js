function firstUppercase(string) {
    const firstLetter = string.charAt(0).toUpperCase();
    const following = string.slice(1);
    const newString = firstLetter + following;
    return newString;
}

function firstLowerCase(string) {
    const firstLetter = string.charAt(0).toLowerCase();
    const following = string.slice(1);
    const newString = firstLetter + following;
    return newString;
}


function transformIntoId(string) {
    let newString = string.toLowerCase();
    newString = newString.replace(/[ ']/g, "");
    newString = newString.replace(/[àáâãäå]/g, "a");
    newString = newString.replace(/[ç]/g, "c");
    newString = newString.replace(/[èéêë]/g, "e");
    newString = newString.replace(/[ìíîï]/g, "i");
    newString = newString.replace(/[ðòóôõö]/g, "o");
    newString = newString.replace(/[ùúûü]/g, "u");
    newString = newString.replace(/[ýÿ]/g, "y");
    return newString;
}


export { firstUppercase, firstLowerCase, transformIntoId };