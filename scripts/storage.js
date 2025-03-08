export function upsertBrew(brew) {
    const brews = getBrews();
    if (!brew.id) {
        brew.id = Date.now().toString(); // Generate a unique ID using the current timestamp
    }

    if (brews.some(existingBrew => existingBrew.id === brew.id)) {
        // Update existing brew
        console.log("Updating brew with ID:", brew.id);
        brews.forEach((existingBrew, index) => {
            if (existingBrew.id === brew.id) {
                brews[index] = brew;
            }
        });
    } else {
        // Add new brew
        console.log("Adding new brew with ID:", brew.id);
        brews.push(brew);
    }
    
    localStorage.setItem('brews', JSON.stringify(brews));
}

export function getBrews() {
    const brews = localStorage.getItem('brews');
    return brews ? JSON.parse(brews) : [];
}

export function getBrewById(id) {
    const brews = getBrews();
    return brews.find(brew => brew.id === id);
}

export function deleteBrew(id) {
    let brews = getBrews();
    brews = brews.filter(brew => brew.id !== id);
    localStorage.setItem('brews', JSON.stringify(brews));
}