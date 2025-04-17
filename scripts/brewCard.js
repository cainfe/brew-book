import { upsertBrew, deleteBrew, getBrewById } from './storage.js';
import { getBeans } from './storage.js';
import { getTastingNotesInput, toggleTastingNotesEditable, getSelectedTastingNotes } from './tastingNotes.js';

export function buildBrewCard(brew = {}) {
    const isNewBrew = Object.keys(brew).length === 0;

    const template = document.getElementById('brew-card-template');

    if (!template) return null;
    const clone = template.content.cloneNode(true);
    
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.getAttribute('id')) element.setAttribute('id', `${element.getAttribute('id')}-${brew.id ? brew.id : 'new'}`);
    });

    const brewCard = clone.querySelector('.brew-card');
    const form = clone.querySelector('form');
    const tastingNotesContainer = clone.querySelector('.tasting-notes-container');

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
        initiateEditBrew(brew.id);
    });

    const saveEditsButton = clone.querySelector('.save-button');
    saveEditsButton.classList.add('hidden');

    const cancelButton = clone.querySelector('.cancel-button');
    cancelButton.addEventListener('click', function () {
        cancelEditBrew(brew.id);
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

    brewCard.appendChild(form);

    return brewCard;
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

function initiateEditBrew(brewId) {
    const brewCard = document.getElementById(`brew-form-${brewId}`);
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

function cancelEditBrew(brewId) {
    const brewCardForm = document.getElementById(`brew-form-${brewId}`);
    if (brewCardForm) {
        const inputs = brewCardForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
        });

        const tastingNotesContainer = brewCardForm.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, false);
        }
        
        const brew = getBrewById(brewId);
        if (brew) {
            const oldBrewCard = brewCardForm.closest('.brew-card');
            const newBrewCard = buildBrewCard(brew);
            oldBrewCard.replaceWith(newBrewCard);
        }

        const saveButton = brewCardForm.querySelector('.save-button');
        const cancelButton = brewCardForm.querySelector('.cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = brewCardForm.querySelector('.edit-button');
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