import { storeBrew, getBrews, deleteBrew } from './storage.js';

const brewFormFields = [
    // Add your form fields here
];

document.addEventListener('DOMContentLoaded', function () {
    buildBrewCard();

    const newBrewForm = document.getElementById('new-brew-form');

    newBrewForm.addEventListener('submit', function (event) {
        event.preventDefault();

        let bean = {
            name: document.getElementById('bean-name').value,
            roaster: document.getElementById('bean-roaster').value,
            roastDate: document.getElementById('bean-roast-date').value,
            variety: document.getElementById('bean-variety').value,
            region: document.getElementById('bean-region').value,
            process: document.getElementById('bean-process').value,
            roastLevel: document.getElementById('bean-roast-level').value,
            tastingNotes: document.getElementById('bean-tasting-notes').value
        }

        // Get the form data
        let data = {
            id: Date.now().toString(),
            method: document.getElementById('method').value,
            bean: bean,
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

    listBrews(getBrews());
});

function buildBrewCard(brew = {}) {
    const isNewBrew = Object.keys(brew).length === 0;

    const brewCard = document.createElement('li');
    brewCard.className = 'brew-card';
    const form = document.createElement('form');
    if (isNewBrew) form.id = 'new-brew-form';
    else form.id = `brew-form-${brew.id}`;

    const sections = [
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
            div.className = 'brew-card-field';

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
    }

    brewCard.appendChild(form);

    document.getElementById("brews-list").appendChild(brewCard);
}

function listBrews(brews = {}) {
    brews.forEach(brew => {
        buildBrewCard(brew);
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