import { deleteBean, getBeanById, upsertBean } from './storage.js';

export function buildBeanCard(bean = {}) {
    const isNewBean = Object.keys(bean).length === 0;

    const beanCard = document.createElement('li');
    beanCard.classList.add('bean-card');
    beanCard.classList.add('content-card');
    const form = document.createElement('form');
    form.classList.add('content-card-form');
    if (isNewBean) form.id = 'new-bean-form';
    else form.id = `bean-form-${bean.id}`;

    const fields = [
        { type: 'hidden', id: 'id', name: 'id', dataName: 'id' },
        { label: 'Name:', type: 'text', id: 'name', name: 'name', dataName: 'name' },
        { label: 'Region/Country:', type: 'text', id: 'region-country', name: 'region-country', dataName: 'regionCountry' },
        { label: 'Altitude:', type: 'text', id: 'altitude', name: 'altitude', dataName: 'altitude' },
        { label: 'Variety:', type: 'text', id: 'variety', name: 'variety', dataName: 'variety' },
        { label: 'Process:', type: 'text', id: 'process', name: 'process', dataName: 'process' },
        { label: 'Roaster:', type: 'text', id: 'roaster', name: 'roaster', dataName: 'roaster' },
        { label: 'Roast Level:', type: 'select', id: 'roast-level', name: 'roast-level', dataName: 'roastLevel', options: ['Light', 'Medium', 'Dark'] },
        { label: 'Tasting Notes (Roaster):', type: 'textarea', id: 'tasting-notes', name: 'tasting-notes', dataName: 'tastingNotes' }
    ];

    fields.forEach(field => {
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

        if (bean[field.dataName]) {
            input.value = bean[field.dataName];
        }

        if (!isNewBean) {
            input.disabled = true;
        }

        div.appendChild(input);
        form.appendChild(div);
    });

    if (isNewBean) {
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = 'bean-submit-button';
        submitButton.textContent = 'Add Bean';
        form.appendChild(submitButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'bean-delete-button';
        deleteButton.textContent = 'Delete Bean';
        deleteButton.addEventListener('click', function () {
            if (confirm(`Are you sure you want to delete the bean "${bean.name}"?`)) 
                submitDeleteBean(bean.id);
        });
        form.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.id = 'bean-edit-button';
        editButton.textContent = 'Edit Bean';
        editButton.addEventListener('click', function () {
            initiateEditBean(bean.id);
        });
        form.appendChild(editButton);

        const saveEditsButton = document.createElement('button');
        saveEditsButton.type = 'submit';
        saveEditsButton.id = 'bean-save-button';
        saveEditsButton.textContent = 'Save Edits';
        saveEditsButton.classList.add('hidden');
        form.appendChild(saveEditsButton);

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.id = 'bean-cancel-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('hidden');
        cancelButton.addEventListener('click', function () {
            cancelEditBean(bean.id);
        });
        form.appendChild(cancelButton);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const beanData = new FormData(form);
        const bean = getBeanFromForm(beanData);
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

        const saveButton = beanCard.querySelector('#bean-save-button');
        const cancelButton = beanCard.querySelector('#bean-cancel-button');
        saveButton.classList.remove('hidden');
        cancelButton.classList.remove('hidden');

        const editButton = beanCard.querySelector('#bean-edit-button');
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
        
        const bean = getBeanById(beanId);
        if (bean) {
            const oldBeanCard = beanCardForm.closest('.bean-card');
            const newBeanCard = buildBeanCard(bean);
            oldBeanCard.replaceWith(newBeanCard);
        }

        const saveButton = beanCardForm.querySelector('#bean-save-button');
        const cancelButton = beanCardForm.querySelector('#bean-cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = beanCardForm.querySelector('#bean-edit-button');
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