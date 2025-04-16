import { upsertBrew, deleteBrew, getBrewById } from './storage.js';
import { getBeans } from './storage.js';
import { getTastingNotesInput, toggleTastingNotesEditable, getSelectedTastingNotes } from './tastingNotes.js';

export function buildBrewCard(brew = {}) {
    const isNewBrew = Object.keys(brew).length === 0;

    const brewCard = document.createElement('li');
    brewCard.classList.add('brew-card');
    brewCard.classList.add('content-card');
    const form = document.createElement('form');
    form.classList.add('content-card-form');
    if (isNewBrew) form.id = 'new-brew-form';
    else form.id = `brew-form-${brew.id}`;

    const methodsContainer = document.createElement('div');
    methodsContainer.classList.add('methods-container');
    const methods = [
        { id: 'method-pour-over-'+(brew.id ? brew.id : 'new'), value: 'Pour Over', imgSrc: './images/pour-over.png', alt: 'Pour Over' },
        { id: 'method-french-press-'+(brew.id ? brew.id : 'new'), value: 'French Press', imgSrc: './images/french-press.png', alt: 'French Press' },
        { id: 'method-aeropress-'+(brew.id ? brew.id : 'new'), value: 'Aeropress', imgSrc: './images/aeropress.png', alt: 'Aeropress' },
        { id: 'method-espresso-'+(brew.id ? brew.id : 'new'), value: 'Espresso', imgSrc: './images/coffee-machine.png', alt: 'Espresso' },
        { id: 'method-cold-brew-'+(brew.id ? brew.id : 'new'), value: 'Cold Brew', imgSrc: './images/cold-brew.png', alt: 'Cold Brew' }
    ];
    
    methods.forEach(method => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'method';
        radio.value = method.value;
        radio.id = method.id;
    
        const label = document.createElement('label');
        label.htmlFor = method.id;
        label.classList.add('method-label');
    
        const img = document.createElement('img');
        img.src = method.imgSrc;
        img.alt = method.alt;
        img.classList.add('method-image');
        img.title = method.value;
    
        label.appendChild(img);

        if (!isNewBrew) {
            radio.disabled = true;
        }

        if (brew.method === method.value) {
            radio.checked = true;
        }

        methodsContainer.appendChild(radio);
        methodsContainer.appendChild(label);
    });

    form.appendChild(methodsContainer);

    const sections = [
        { header: null, fields: [{ type: 'hidden', name: 'id', dataName: 'id' }] },
        { header: null, fields: [
            { label: 'Date:', type: 'date', name: 'date', dataName: 'date' },
            { label: 'Time:', type: 'time', name: 'time', dataName: 'time' },
            { label: 'Beans:', type: 'select', name: 'bean-id', dataName: 'beanId', options: ['Select Bean'] }
        ] },
        { header: 'Water', fields: [
            { label: 'Temperature:', type: 'number', name: 'water-temperature', dataName: 'waterTemperature' },
            { label: 'Volume:', type: 'number', name: 'water-volume', dataName: 'waterVolume' }
        ]},
        { header: 'Brewing Parameters', fields: [
            { label: 'Grind Setting:', type: 'number', name: 'grind-setting', dataName: 'grindSetting' },
            { label: 'Dose (g):', type: 'number', step: '0.1', name: 'dose', dataName: 'dose' },
            { label: 'Yield (g):', type: 'number', step: '0.1', name: 'yield', dataName: 'yield' },
            { label: 'Brew Ratio:', type: 'number', step: '0.1', name: 'brew-ratio', dataName: 'brewRatio' },
            { label: 'Elapsed Time (s):', type: 'number', step: '1', name: 'elapsed-time', dataName: 'elapsedTime' }
        ]},
        { header: 'Sensory Profile', fields: [
            { label: 'Aroma:', type: 'text', name: 'aroma', dataName: 'aroma' },
            { label: 'Flavor:', type: 'text', name: 'flavor', dataName: 'flavor' },
            { label: 'Acidity:', type: 'text', name: 'acidity', dataName: 'acidity' },
            { label: 'Body:', type: 'text', name: 'body', dataName: 'body' },
            { label: 'Aftertaste:', type: 'text', name: 'aftertaste', dataName: 'aftertaste' },
            { label: 'Overall:', type: 'text', name: 'overall-impression', dataName: 'overallImpression' }
        ]},
        { header: 'Tasting Notes', fields: [] }
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
                label.textContent = field.label;
                div.appendChild(label);
            }

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.name = field.name;
                field.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    input.appendChild(opt);
                });

                if (field.name === 'bean-id') {
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
                input.name = field.name;
                if (field.name === 'notes') {
                    input.classList.add('full-width');
                }
            } else {
                input = document.createElement('input');
                input.type = field.type;
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

    const tastingNotesContainer = getTastingNotesInput(brew.tastingNotes ? brew.tastingNotes.split(', ') : []);
    if (!isNewBrew) {
        toggleTastingNotesEditable(tastingNotesContainer, false);
    }
    form.appendChild(tastingNotesContainer);

    if (isNewBrew) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Add Brew';
        submitButton.classList.add('submit-button');
        form.appendChild(submitButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete Brew';
        deleteButton.classList.add('delete-button');
        deleteButton.classList.add('dangerous');
        deleteButton.addEventListener('click', function () {
            if (confirm("Are you sure you want to delete this brew?"))
                submitDeleteBrew(brew.id);
        });
        form.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit Brew';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function () {
            initiateEditBrew(brew.id);
        });
        form.appendChild(editButton);

        const saveEditsButton = document.createElement('button');
        saveEditsButton.type = 'submit';
        saveEditsButton.textContent = 'Save Edits';
        saveEditsButton.classList.add('hidden');
        saveEditsButton.classList.add('save-button');
        form.appendChild(saveEditsButton);

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('hidden');
        cancelButton.classList.add('cancel-button');
        cancelButton.addEventListener('click', function () {
            cancelEditBrew(brew.id);
        });
        form.appendChild(cancelButton);
    }

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