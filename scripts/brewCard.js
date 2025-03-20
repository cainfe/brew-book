import { upsertBrew, deleteBrew, getBrewById } from './storage.js';
import { getBeans } from './storage.js';

export function buildBrewCard(brew = {}) {
    const isNewBrew = Object.keys(brew).length === 0;

    const brewCard = document.createElement('li');
    brewCard.classList.add('brew-card');
    brewCard.classList.add('content-card');
    const form = document.createElement('form');
    form.classList.add('content-card-form');
    if (isNewBrew) form.id = 'new-brew-form';
    else form.id = `brew-form-${brew.id}`;

    const sections = [
        { header: null, fields: [{ type: 'hidden', id: 'id', name: 'id', dataName: 'id' }] },
        { header: null, fields: [
            { label: 'Method:', type: 'select', id: 'method', name: 'method', dataName: 'method', options: ['Pour Over', 'French Press', 'Aeropress', 'Espresso', 'Cold Brew', 'Other: [Specify]'] },
            { label: 'Date:', type: 'date', id: 'date', name: 'date', dataName: 'date' },
            { label: 'Time:', type: 'time', id: 'time', name: 'time', dataName: 'time' },
            { label: 'Beans:', type: 'select', id: 'bean-id', name: 'bean-id', dataName: 'beanId', options: ['Select Bean'] }
        ] },
        { header: 'Water', fields: [
            { label: 'Temperature:', type: 'number', id: 'water-temperature', name: 'water-temperature', dataName: 'waterTemperature' },
            { label: 'Volume:', type: 'number', id: 'water-volume', name: 'water-volume', dataName: 'waterVolume' }
        ]},
        { header: 'Brewing Parameters', fields: [
            { label: 'Grind Setting:', type: 'number', id: 'grind-setting', name: 'grind-setting', dataName: 'grindSetting' },
            { label: 'Dose (g):', type: 'number', step: '0.1', id: 'dose', name: 'dose', dataName: 'dose' },
            { label: 'Yield (g):', type: 'number', step: '0.1', id: 'yield', name: 'yield', dataName: 'yield' },
            { label: 'Brew Ratio:', type: 'number', step: '0.1', id: 'brew-ratio', name: 'brew-ratio', dataName: 'brewRatio' },
            { label: 'Elapsed Time (s):', type: 'number', step: '1', id: 'elapsed-time', name: 'elapsed-time', dataName: 'elapsedTime' }
        ]},
        { header: 'Tasting Notes', fields: [
            { label: 'Aroma:', type: 'text', id: 'aroma', name: 'aroma', dataName: 'aroma' },
            { label: 'Flavor:', type: 'text', id: 'flavor', name: 'flavor', dataName: 'flavor' },
            { label: 'Acidity:', type: 'text', id: 'acidity', name: 'acidity', dataName: 'acidity' },
            { label: 'Body:', type: 'text', id: 'body', name: 'body', dataName: 'body' },
            { label: 'Aftertaste:', type: 'text', id: 'aftertaste', name: 'aftertaste', dataName: 'aftertaste' },
            { label: 'Overall:', type: 'text', id: 'overall-impression', name: 'overall-impression', dataName: 'overallImpression' }
        ]},
        { header: 'Notes', fields: [
            { label: null, type: 'textarea', id: 'notes', name: 'notes', dataName: 'notes' }
        ]}
    ];

    sections.forEach(section => {
        if (section.header) {
            const header = document.createElement('h3');
            header.textContent = section.header;
            form.appendChild(header);
        }

        section.fields.forEach(field => {
            const div = document.createElement('div');
            div.classList.add('content-card-form-field');

            if (field.label) {
                const label = document.createElement('label');
                label.htmlFor = field.id;
                label.textContent = field.label;
                div.appendChild(label);
            }

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.id = field.id;
                input.name = field.name;
                field.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    input.appendChild(opt);
                });

                if (field.id === 'bean-id') {
                    const beans = getBeans();
                    beans.forEach(bean => {
                        const opt = document.createElement('option');
                        opt.value = bean.id;
                        opt.textContent = bean.name;
                        input.appendChild(opt);
                    });
                }
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.id = field.id;
                input.name = field.name;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.name = field.name;
                if (field.step) {
                    input.step = field.step;
                }
            }

            if (brew[field.dataName]) {
                input.value = brew[field.dataName];
            }

            if (!isNewBrew) {
                input.disabled = true;
            }

            div.appendChild(input);
            form.appendChild(div);
        });
    });

    if (isNewBrew) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'brew-submit-button';
        submitButton.textContent = 'Add Brew';
        form.appendChild(submitButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'brew-delete-button';
        deleteButton.textContent = 'Delete Brew';
        deleteButton.addEventListener('click', function () {
            submitDeleteBrew(brew.id);
        });
        form.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.id = 'brew-edit-button';
        editButton.textContent = 'Edit Brew';
        editButton.addEventListener('click', function () {
            initiateEditBrew(brew.id);
        });
        form.appendChild(editButton);

        const saveEditsButton = document.createElement('button');
        saveEditsButton.type = 'submit';
        saveEditsButton.id = 'brew-save-button';
        saveEditsButton.textContent = 'Save Edits';
        saveEditsButton.classList.add('hidden');
        form.appendChild(saveEditsButton);

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.id = 'brew-cancel-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('hidden');
        cancelButton.addEventListener('click', function () {
            cancelEditBrew(brew.id);
        });
        form.appendChild(cancelButton);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const brewData = new FormData(form);
        const brew = getBrewFromForm(brewData);
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

        const saveButton = brewCard.querySelector('#brew-save-button');
        const cancelButton = brewCard.querySelector('#brew-cancel-button');
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');

        const editButton = brewCard.querySelector('#brew-edit-button');
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
        
        const brew = getBrewById(brewId);
        if (brew) {
            const oldBrewCard = brewCardForm.closest('.brew-card');
            const newBrewCard = buildBrewCard(brew);
            oldBrewCard.replaceWith(newBrewCard);
        }

        const saveButton = brewCardForm.querySelector('#brew-save-button');
        const cancelButton = brewCardForm.querySelector('#brew-cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = brewCardForm.querySelector('#brew-edit-button');
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

    if (!brewFormData.get('id')) {
        brew.id = Date.now().toString();
    } else {
        brew.id = brewFormData.get('id');
    }

    return brew;
}