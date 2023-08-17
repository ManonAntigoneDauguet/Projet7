function firstUppercase(string) {
    const firstLetter = string.charAt(0).toUpperCase();
    const following = string.slice(1);
    const newString = firstLetter + following;
    return newString;
}

export default firstUppercase;