export function storeBrew(brew) {
    const brews = getBrews();
    if (!brew.id) {
        brew.id = Date.now().toString(); // Generate a unique ID using the current timestamp
    }
    brews.push(brew);
    localStorage.setItem('brews', JSON.stringify(brews));
}

export function getBrews() {
    const brews = localStorage.getItem('brews');
    return brews ? JSON.parse(brews) : [];
}