import { deleteBean, getBeanById, upsertBean } from './storage.js';
import { getTastingNotesInput, toggleTastingNotesEditable, getSelectedTastingNotes } from './tastingNotes.js';

export function buildBeanCard(bean = {}) {
    const isNewBean = Object.keys(bean).length === 0;

    const beanCard = document.createElement('li');
    beanCard.classList.add('bean-card');
    beanCard.classList.add('content-card');
    const form = document.createElement('form');
    form.classList.add('content-card-form');
    if (isNewBean) form.id = 'new-bean-form';
    else form.id = `bean-form-${bean.id}`;

    const sections = [
        { header: null, fields: [
            { type: 'hidden', name: 'id', dataName: 'id' }
        ]},
        { header: null, fields: [
            { label: 'Name:', type: 'text', name: 'name', dataName: 'name' },
            { label: 'Region/Country:', type: 'text', name: 'region-country', dataName: 'regionCountry' },
            { label: 'Altitude:', type: 'text', name: 'altitude', dataName: 'altitude' },
            { label: 'Variety:', type: 'text', name: 'variety', dataName: 'variety' },
            { label: 'Process:', type: 'text', name: 'process', dataName: 'process' },
            { label: 'Roaster:', type: 'text', name: 'roaster', dataName: 'roaster' },
            { label: 'Roast Level:', type: 'select', name: 'roast-level', dataName: 'roastLevel', options: ['Light', 'Medium', 'Dark'] },
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
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.name = field.name;
                if (field.name === 'tasting-notes') {
                    input.classList.add('full-width');
                }
            } else if (field.type === 'hidden') {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = field.name;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
            }

            if (bean[field.dataName]) {
                input.value = bean[field.dataName];
            }

            if (!isNewBean) {
                input.disabled = true;
            }

            div.appendChild(input);
            form.appendChild(div);
        });
    });

    const tastingNotesContainer = getTastingNotesInput(bean.tastingNotes ? bean.tastingNotes.split(', ') : []);
    if (!isNewBean) {
        toggleTastingNotesEditable(tastingNotesContainer, false);
    }
    form.appendChild(tastingNotesContainer);

    if (isNewBean) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Add Bean';
        submitButton.classList.add('submit-button');
        form.appendChild(submitButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete Bean';
        deleteButton.classList.add('delete-button');
        deleteButton.classList.add('dangerous');
        deleteButton.addEventListener('click', function () {
            if (confirm(`Are you sure you want to delete the bean "${bean.name}"?`)) 
                submitDeleteBean(bean.id);
        });
        form.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit Bean';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function () {
            initiateEditBean(bean.id);
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
            cancelEditBean(bean.id);
        });
        form.appendChild(cancelButton);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const beanData = new FormData(form);
        const bean = getBeanFromForm(beanData);

        const tastingNotes = getSelectedTastingNotes(tastingNotesContainer);
        bean.tastingNotes = tastingNotes ? tastingNotes.join(', ') : '';

        upsertBean(bean);

        if (isNewBean) {
            const newBeanCard = buildBeanCard(bean);
            document.getElementById("beans-list").appendChild(newBeanCard);
            form.reset();
        } else {
            const updatedBeanCard = buildBeanCard(bean);
            beanCard.replaceWith(updatedBeanCard);
        }
    });

    beanCard.appendChild(form);

    return beanCard;
}

export function listBeans(beans = {}) {
    beans.forEach(bean => {
        const beanCard = buildBeanCard(bean);
        document.getElementById("beans-list").appendChild(beanCard);
    });
}

function submitDeleteBean(beanId) {
    deleteBean(beanId);
    
    const beanCard = document.getElementById(`bean-form-${beanId}`);
    if (beanCard) {
        const beanCardContainer = beanCard.closest('.bean-card');
        if (beanCardContainer) {
            beanCardContainer.remove();
        }
    }
}

function initiateEditBean(beanId) {
    const beanCard = document.getElementById(`bean-form-${beanId}`);
    if (beanCard) {
        const inputs = beanCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = false;
        });

        const tastingNotesContainer = beanCard.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, true);
        }

        const saveButton = beanCard.querySelector('.save-button');
        const cancelButton = beanCard.querySelector('.cancel-button');
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');

        const editButton = beanCard.querySelector('.edit-button');
        editButton.classList.add('hidden');
    }
}

function cancelEditBean(beanId) {
    const beanCardForm = document.getElementById(`bean-form-${beanId}`);
    if (beanCardForm) {
        const inputs = beanCardForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
        });

        const tastingNotesContainer = beanCardForm.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, false);
        }
        
        const bean = getBeanById(beanId);
        if (bean) {
            const oldBeanCard = beanCardForm.closest('.bean-card');
            const newBeanCard = buildBeanCard(bean);
            oldBeanCard.replaceWith(newBeanCard);
        }

        const saveButton = beanCardForm.querySelector('.save-button');
        const cancelButton = beanCardForm.querySelector('.cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = beanCardForm.querySelector('.edit-button');
        editButton.classList.remove('hidden');
    }
}

function getBeanFromForm(beanFormData) {
    let bean = {
        name: beanFormData.get('name'),
        regionCountry: beanFormData.get('region-country'),
        altitude: beanFormData.get('altitude'),
        variety: beanFormData.get('variety'),
        process: beanFormData.get('process'),
        roaster: beanFormData.get('roaster'),
        roastLevel: beanFormData.get('roast-level'),
        tastingNotes: beanFormData.get('tasting-notes')
    }

    if (!beanFormData.get('id')) {
        bean.id = Date.now().toString();
    } else {
        bean.id = beanFormData.get('id');
    }

    return bean;
}