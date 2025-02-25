export function storeBrew(data = {}) {
    // validate the input data
    if (!data) return;

    // Create a new Brew object
    let bean = {
        name: data.beanName,
        roaster: data.beanRoaster,
        roastDate: data.beanRoastDate,
        variety: data.beanVariety,
        region: data.beanRegion,
        process: data.beanProcess,
        roastLevel: data.beanRoastLevel,
        tastingNotes: data.beanTastingNotes
    }

    let brew = {
        method: data.method,
        bean: bean,
        grindSetting: data.grindSetting,
        grindDescription: data.grindDescription,
        waterSource: data.waterSource,
        waterTemperature: data.waterTemperature,
        waterVolume: data.waterVolume,
        bloom: data.bloom,
        bloomWaterVolume: data.bloomWaterVolume,
        bloomTime: data.bloomTime,
        pouringMethod: data.pouringMethod,
        totalBrewTime: data.totalBrewTime,
        ratio: data.ratio,
        aroma: data.aroma,
        flavor: data.flavor,
        acidity: data.acidity,
        body: data.body,
        aftertaste: data.aftertaste,
        overallImpression: data.overallImpression,
        notes: data.notes
    }

    console.log(brew);
    console.log("here");

    // Store the new Brew object in localStorage
    let brews = JSON.parse(localStorage.getItem('brews')) || [];
    brews.push(brew);
    localStorage.setItem('brews', JSON.stringify(brews));
}

export function getBrews() {
    return JSON.parse(localStorage.getItem('brews')) || [];
}