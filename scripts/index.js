import { upsertBrew, getBrews, getBrewById, deleteBrew } from './storage.js';
import { toggleMenu } from './sideMenu.js';

document.addEventListener('DOMContentLoaded', function () {
    const newBrewCard = buildBrewCard();
    document.getElementById("brews-list").appendChild(newBrewCard);

    listBrews(getBrews());
});

function buildBrewCard(brew = {}) {
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
        { header: null, fields: [{ label: 'Method:', type: 'select', id: 'method', name: 'method', dataName: 'method', options: ['Pour Over', 'French Press', 'Aeropress', 'Espresso', 'Cold Brew', 'Other: [Specify]'] }] },
        { header: 'Coffee Beans', fields: [
            { label: 'Name:', type: 'text', id: 'bean-name', name: 'bean-name', dataName: 'bean.name' },
            { label: 'Roaster:', type: 'text', id: 'bean-roaster', name: 'bean-roaster', dataName: 'bean.roaster' },
            { label: 'Roast Date:', type: 'date', id: 'bean-roast-date', name: 'bean-roast-date', dataName: 'bean.roastDate' },
            { label: 'Variety:', type: 'text', id: 'bean-variety', name: 'bean-variety', dataName: 'bean.variety' },
            { label: 'Region/Country:', type: 'text', id: 'bean-region', name: 'bean-region', dataName: 'bean.region' },
            { label: 'Process:', type: 'text', id: 'bean-process', name: 'bean-process', dataName: 'bean.process' },
            { label: 'Roast Level:', type: 'select', id: 'bean-roast-level', name: 'bean-roast-level', dataName: 'bean.roastLevel', options: ['Light', 'Medium', 'Dark'] },
            { label: 'Tasting Notes (Roaster):', type: 'textarea', id: 'bean-tasting-notes', name: 'bean-tasting-notes', dataName: 'bean.tastingNotes' }
        ]},
        { header: 'Grind Size', fields: [
            { label: 'Setting:', type: 'number', id: 'grind-setting', name: 'grind-setting', dataName: 'grindSetting' },
            { label: 'Description:', type: 'text', id: 'grind-description', name: 'grind-description', dataName: 'grindDescription' }
        ]},
        { header: 'Water', fields: [
            { label: 'Source:', type: 'text', id: 'water-source', name: 'water-source', dataName: 'waterSource' },
            { label: 'Temperature:', type: 'number', id: 'water-temperature', name: 'water-temperature', dataName: 'waterTemperature' },
            { label: 'Volume:', type: 'number', id: 'water-volume', name: 'water-volume', dataName: 'waterVolume' }
        ]},
        { header: 'Brewing Parameters', fields: [
            { label: 'Bloom:', type: 'number', id: 'bloom', name: 'bloom', dataName: 'bloom' },
            { label: 'Water Volume:', type: 'number', id: 'bloom-water-volume', name: 'bloom-water-volume', dataName: 'bloomWaterVolume' },
            { label: 'Bloom time:', type: 'number', id: 'bloom-time', name: 'bloom-time', dataName: 'bloomTime' },
            { label: 'Pouring Method:', type: 'text', id: 'pouring-method', name: 'pouring-method', dataName: 'pouringMethod' },
            { label: 'Total Brew Time:', type: 'number', id: 'total-brew-time', name: 'total-brew-time', dataName: 'totalBrewTime' },
            { label: 'Ratio (Coffee:Water):', type: 'text', id: 'ratio', name: 'ratio', dataName: 'ratio' }
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
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.id = field.id;
                input.name = field.name;
            } else if (field.type === 'hidden') {
                input = document.createElement('input');
                input.type = 'hidden';
                input.id = field.id;
                input.name = field.name;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.name = field.name;
            }

            if (brew[field.dataName]) {
                input.value = brew[field.dataName];
            } else if (field.dataName.startsWith("bean.") && brew.bean && brew.bean[field.dataName.substring(5)]) {
                input.value = brew.bean[field.dataName.substring(5)];
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

function listBrews(brews = {}) {
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
    let bean = {
        name: brewFormData.get('bean-name'),
        roaster: brewFormData.get('bean-roaster'),
        roastDate: brewFormData.get('bean-roast-date'),
        variety: brewFormData.get('bean-variety'),
        region: brewFormData.get('bean-region'),
        process: brewFormData.get('bean-process'),
        roastLevel: brewFormData.get('bean-roast-level'),
        tastingNotes: brewFormData.get('bean-tasting-notes')
    }

    let brew = {
        method: brewFormData.get('method'),
        bean: bean,
        grindSetting: brewFormData.get('grind-setting'),
        grindDescription: brewFormData.get('grind-description'),
        waterSource: brewFormData.get('water-source'),
        waterTemperature: brewFormData.get('water-temperature'),
        waterVolume: brewFormData.get('water-volume'),
        bloom: brewFormData.get('bloom'),
        bloomWaterVolume: brewFormData.get('bloom-water-volume'),
        bloomTime: brewFormData.get('bloom-time'),
        pouringMethod: brewFormData.get('pouring-method'),
        totalBrewTime: brewFormData.get('total-brew-time'),
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

window.toggleMenu = toggleMenu;
