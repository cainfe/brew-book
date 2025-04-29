import { upsertBrew, deleteBrew, getBrewById } from './storage.js';
import { getBeans } from './storage.js';
import { getTastingNotesInput, toggleTastingNotesEditable, getSelectedTastingNotes, selectTastingNotes } from './tastingNotes.js';

export function buildBrewCard(brew = {}) {
    const isNewBrew = Object.keys(brew).length === 0;

    const template = document.getElementById('brew-card-template');

    if (!template) return null;
    const clone = template.content.cloneNode(true);
    
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.getAttribute('id')) {
            const newId = `${element.getAttribute('id')}-${brew.id ? brew.id : 'new'}`;
            allElements.forEach(forElement => {
                if (forElement.getAttribute('for') === element.getAttribute('id')) {
                    forElement.setAttribute('for', newId);
                }
            });
            element.setAttribute('id', newId);
        }
    });

    const brewCard = clone.querySelector('.brew-card');
    const form = clone.querySelector('form');

    const tastingNotesContainer = getTastingNotesInput();
    const tastingNotesTitle = clone.querySelector('.tasting-notes-title');
    toggleTastingNotesEditable(tastingNotesContainer, isNewBrew);
    if (tastingNotesTitle) {
        tastingNotesTitle.after(tastingNotesContainer);
    }

    const beans = getBeans();
    const beanSelect = clone.querySelector('select[name="bean-id"]');
    if (beanSelect) {
        beans.forEach(bean => {
            const option = document.createElement('option');
            option.value = bean.id;
            option.textContent = bean.name;
            if (brew.beanId === bean.id) option.selected = true;
            beanSelect.appendChild(option);
        });
    }

    const submitButton = clone.querySelector('.submit-button');
    if (isNewBrew) submitButton.classList.remove('hidden');
    else submitButton.classList.add('hidden');

    const deleteButton = clone.querySelector('.delete-button');
    if (isNewBrew) deleteButton.classList.add('hidden');
    else deleteButton.classList.remove('hidden');
    deleteButton.addEventListener('click', function () {
        if (confirm("Are you sure you want to delete this brew?"))
            submitDeleteBrew(brew.id);
    });

    const editButton = clone.querySelector('.edit-button');
    if (isNewBrew) editButton.classList.add('hidden');
    else editButton.classList.remove('hidden');
    editButton.addEventListener('click', function () {
        enableBrewEditing(brewCard);
    });

    const saveEditsButton = clone.querySelector('.save-button');
    saveEditsButton.classList.add('hidden');

    const cancelButton = clone.querySelector('.cancel-button');
    cancelButton.addEventListener('click', function () {
        disableBrewEditing(brewCard);
    });


    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const brewData = new FormData(form);
        const brew = getBrewFromForm(brewData);

        const tastingNotes = getSelectedTastingNotes(tastingNotesContainer);
        brew.tastingNotes = tastingNotes ? tastingNotes.join(', ') : '';

        upsertBrew(brew);
        
        if (isNewBrew) {
            const newBrewCard = buildBrewCard(brew);
            document.getElementById("brews-list").appendChild(newBrewCard);
            form.reset();
        } else {
            const updatedBrewCard = buildBrewCard(brew);
            brewCard.replaceWith(updatedBrewCard);
        }
    });

    if (!isNewBrew) {
        populateBrewCardFields(brew, brewCard);
        disableBrewEditing(brewCard);
    }

    brewCard.appendChild(form);

    return brewCard;
}

function populateBrewCardFields(brew, brewCard) {
    if (!brew || !brewCard) return;

    brewCard.querySelector('input[name="id"]').value = brew.id || '';
    const methodRadio = brewCard.querySelector(`input[name="method"][value="${brew.method}"]`);
    if (methodRadio) {
        methodRadio.checked = true;
    }
    brewCard.querySelector('input[name="date"]').value = brew.date || '';
    brewCard.querySelector('input[name="time"]').value = brew.time || '';
    brewCard.querySelector('select[name="bean-id"]').value = brew.beanId || '';
    brewCard.querySelector('input[name="grind-setting"]').value = brew.grindSetting || '';
    brewCard.querySelector('input[name="water-temperature"]').value = brew.waterTemperature || '';
    brewCard.querySelector('input[name="water-volume"]').value = brew.waterVolume || '';
    brewCard.querySelector('input[name="dose"]').value = brew.dose || '';
    brewCard.querySelector('input[name="yield"]').value = brew.yield || '';
    brewCard.querySelector('input[name="brew-ratio"]').value = brew.brewRatio || '';
    brewCard.querySelector('input[name="elapsed-time"]').value = brew.elapsedTime || '';
    brewCard.querySelector('input[name="aroma"]').value = brew.aroma || '';
    brewCard.querySelector('input[name="flavor"]').value = brew.flavor || '';
    brewCard.querySelector('input[name="acidity"]').value = brew.acidity || '';
    brewCard.querySelector('input[name="body"]').value = brew.body || '';
    brewCard.querySelector('input[name="aftertaste"]').value = brew.aftertaste || '';
    brewCard.querySelector('input[name="overall-impression"]').value = brew.overallImpression || '';

    const tastingNotesContainer = brewCard.querySelector('.tasting-notes-container');
    if (tastingNotesContainer) {
        const tastingNotes = brew.tastingNotes ? brew.tastingNotes.split(', ') : [];
        selectTastingNotes(tastingNotesContainer, tastingNotes);
    }
}

export function listBrews(brews = {}) {
    brews.forEach(brew => {
        const brewCard = buildBrewCard(brew);
        document.getElementById("brews-list").appendChild(brewCard);
    });
}

function submitDeleteBrew(brewId) {
    deleteBrew(brewId);
    
    const brewCard = document.getElementById(`brew-form-${brewId}`);
    if (brewCard) {
        const brewCardContainer = brewCard.closest('.brew-card');
        if (brewCardContainer) {
            brewCardContainer.remove();
        }
    }
}

function enableBrewEditing(brewCard) {
    if (brewCard) {
        const inputs = brewCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = false;
        });

        const tastingNotesContainer = brewCard.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, true);
        }

        const saveButton = brewCard.querySelector('.save-button');
        const cancelButton = brewCard.querySelector('.cancel-button');
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');

        const editButton = brewCard.querySelector('.edit-button');
        editButton.classList.add('hidden');
    }
}

function disableBrewEditing(brewCard) {
    if (brewCard) {
        const inputs = brewCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
        });

        const tastingNotesContainer = brewCard.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, false);
        }
        
        const brew = getBrewById(brewCard.querySelector('input[name="id"]').value);
        if (brew) {
            populateBrewCardFields(brew, brewCard);
        }

        const saveButton = brewCard.querySelector('.save-button');
        const cancelButton = brewCard.querySelector('.cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = brewCard.querySelector('.edit-button');
        editButton.classList.remove('hidden');
    }
}

function getBrewFromForm(brewFormData) {
    let brew = {
        method: brewFormData.get('method'),
        date: brewFormData.get('date'),
        time: brewFormData.get('time'),
        beanId: brewFormData.get('bean-id'),
        grindSetting: brewFormData.get('grind-setting'),
        waterTemperature: brewFormData.get('water-temperature'),
        waterVolume: brewFormData.get('water-volume'),
        dose: brewFormData.get('dose'),
        yield: brewFormData.get('yield'),
        brewRatio: brewFormData.get('brew-ratio'),
        elapsedTime: brewFormData.get('elapsed-time'),
        ratio: brewFormData.get('ratio'),
        aroma: brewFormData.get('aroma'),
        flavor: brewFormData.get('flavor'),
        acidity: brewFormData.get('acidity'),
        body: brewFormData.get('body'),
        aftertaste: brewFormData.get('aftertaste'),
        overallImpression: brewFormData.get('overall-impression'),
        notes: brewFormData.get('notes')
    }

    if (brewFormData.get('id')) {
        brew.id = brewFormData.get('id');
    }

    return brew;
}