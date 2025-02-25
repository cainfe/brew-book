import { storeBrew } from './storage.js';

document.addEventListener('DOMContentLoaded', function () {
    buildBrewCard();

    const newBrewForm = document.getElementById('new-brew-form');

    newBrewForm.addEventListener('submit', function (event) {
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

function buildBrewCard(data = {}) {
    const form = document.createElement('form');
    form.id = 'new-brew-form';
    form.className = 'brew-card';

    const sections = [
        { header: null, fields: [{ label: 'Method:', type: 'select', id: 'method', name: 'method', options: ['Pour Over', 'French Press', 'Aeropress', 'Espresso', 'Cold Brew', 'Other: [Specify]'] }] },
        { header: 'Coffee Beans', fields: [
            { label: 'Name:', type: 'text', id: 'bean-name', name: 'bean-name' },
            { label: 'Roaster:', type: 'text', id: 'bean-roaster', name: 'bean-roaster' },
            { label: 'Roast Date:', type: 'date', id: 'bean-roast-date', name: 'bean-roast-date' },
            { label: 'Variety:', type: 'text', id: 'bean-variety', name: 'bean-variety' },
            { label: 'Region/Country:', type: 'text', id: 'bean-region', name: 'bean-region' },
            { label: 'Process:', type: 'text', id: 'bean-process', name: 'bean-process' },
            { label: 'Roast Level:', type: 'select', id: 'bean-roast-level', name: 'bean-roast-level', options: ['Light', 'Medium', 'Dark'] },
            { label: 'Tasting Notes (Roaster):', type: 'textarea', id: 'bean-tasting-notes', name: 'bean-tasting-notes' }
        ]},
        { header: 'Grind Size', fields: [
            { label: 'Setting:', type: 'number', id: 'grind-setting', name: 'grind-setting' },
            { label: 'Description:', type: 'text', id: 'grind-description', name: 'grind-description' }
        ]},
        { header: 'Water', fields: [
            { label: 'Source:', type: 'text', id: 'water-source', name: 'water-source' },
            { label: 'Temperature:', type: 'number', id: 'water-temperature', name: 'water-temperature' },
            { label: 'Volume:', type: 'number', id: 'water-volume', name: 'water-volume' }
        ]},
        { header: 'Brewing Parameters', fields: [
            { label: 'Bloom:', type: 'number', id: 'bloom', name: 'bloom' },
            { label: 'Water Volume:', type: 'number', id: 'bloom-water-volume', name: 'bloom-water-volume' },
            { label: 'Bloom time:', type: 'number', id: 'bloom-time', name: 'bloom-time' },
            { label: 'Pouring Method:', type: 'text', id: 'pouring-method', name: 'pouring-method' },
            { label: 'Total Brew Time:', type: 'number', id: 'total-brew-time', name: 'total-brew-time' },
            { label: 'Ratio (Coffee:Water):', type: 'text', id: 'ratio', name: 'ratio' }
        ]},
        { header: 'Tasting Notes', fields: [
            { label: 'Aroma:', type: 'text', id: 'aroma', name: 'aroma' },
            { label: 'Flavor:', type: 'text', id: 'flavor', name: 'flavor' },
            { label: 'Acidity:', type: 'text', id: 'acidity', name: 'acidity' },
            { label: 'Body:', type: 'text', id: 'body', name: 'body' },
            { label: 'Aftertaste:', type: 'text', id: 'aftertaste', name: 'aftertaste' },
            { label: 'Overall:', type: 'text', id: 'overall-impression', name: 'overall-impression' }
        ]},
        { header: 'Notes', fields: [
            { label: null, type: 'textarea', id: 'notes', name: 'notes' }
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
                if (data[field.name]) {
                    input.value = data[field.name];
                }
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.id = field.id;
                input.name = field.name;
                if (data[field.name]) {
                    input.value = data[field.name];
                }
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.name = field.name;
                if (data[field.name]) {
                    input.value = data[field.name];
                }
            }

            div.appendChild(input);
            form.appendChild(div);
        });
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.id = 'submit-button';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);

    document.body.appendChild(form);
}