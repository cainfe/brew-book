import { storeBrew } from './storage.js';

document.addEventListener('DOMContentLoaded', function () {
    const newBrewForm = document.getElementById('new-brew-form');

    newBrewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get the form data
        let data = {
            method: document.getElementById('method').value,
            beanName: document.getElementById('bean-name').value,
            beanRoaster: document.getElementById('bean-roaster').value,
            beanRoastDate: document.getElementById('bean-roast-date').value,
            beanVariety: document.getElementById('bean-variety').value,
            beanRegion: document.getElementById('bean-region').value,
            beanProcess: document.getElementById('bean-process').value,
            beanRoastLevel: document.getElementById('bean-roast-level').value,
            beanTastingNotes: document.getElementById('bean-tasting-notes').value,
            grindSetting: document.getElementById('grind-setting').value,
            grindDescription: document.getElementById('grind-description').value,
            waterSource: document.getElementById('water-source').value,
            waterTemperature: document.getElementById('water-temperature').value,
            waterVolume: document.getElementById('water-volume').value,
            bloom: document.getElementById('bloom').value,
            bloomWaterVolume: document.getElementById('bloom-water-volume').value,
            bloomTime: document.getElementById('bloom-time').value,
            pouringMethod: document.getElementById('pouring-method').value,
            totalBrewTime: document.getElementById('total-brew-time').value,
            ratio: document.getElementById('ratio').value,
            aroma: document.getElementById('aroma').value,
            flavor: document.getElementById('flavor').value,
            acidity: document.getElementById('acidity').value,
            body: document.getElementById('body').value,
            aftertaste: document.getElementById('aftertaste').value,
            overallImpression: document.getElementById('overall-impression').value,
            notes: document.getElementById('notes').value
        }

        // Store the brew data
        storeBrew(data);
    });
});

function storeBrewData(data) {
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