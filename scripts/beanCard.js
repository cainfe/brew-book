import { deleteBean, getBeanById, upsertBean } from './storage.js';
import { getTastingNotesInput, toggleTastingNotesEditable, getSelectedTastingNotes, selectTastingNotes } from './tastingNotes.js';

export function buildBeanCard(bean = {}) {
    const isNewBean = Object.keys(bean).length === 0;

    const template = document.getElementById('bean-card-template');

    if (!template) {
        console.error('Bean card template not found!');
        return null;
    }
    const clone = template.content.cloneNode(true);

    const allElements = clone.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.getAttribute('id')) {
            const newId = `${element.getAttribute('id')}-${bean.id ? bean.id : 'new'}`;
            allElements.forEach(forElement => {
                if (forElement.getAttribute('for') === element.getAttribute('id')) {
                    forElement.setAttribute('for', newId);
                }
            });
            element.setAttribute('id', newId);
        }
    });

    const beanCard = clone.querySelector('.bean-card');
    const form = clone.querySelector('form');

    const tastingNotesContainer = getTastingNotesInput();
    const tastingNotesTitle = clone.querySelector('.tasting-notes-title');
    toggleTastingNotesEditable(tastingNotesContainer, isNewBean);
    if (tastingNotesTitle) {
        tastingNotesTitle.after(tastingNotesContainer);
    }

    const submitButton = clone.querySelector('.submit-button');
    if (isNewBean) submitButton.classList.remove('hidden');
    else submitButton.classList.add('hidden');

    const deleteButton = clone.querySelector('.delete-button');
    if (isNewBean) deleteButton.classList.add('hidden');
    else deleteButton.classList.remove('hidden');
    deleteButton.addEventListener('click', function () {
        if (confirm(`Are you sure you want to delete the bean "${bean.name}"?`)) 
            submitDeleteBean(bean.id);
    });

    const editButton = clone.querySelector('.edit-button');
    if (isNewBean) editButton.classList.add('hidden');
    else editButton.classList.remove('hidden');
    editButton.addEventListener('click', function () {
        enableBeanEditing(beanCard);
    });

    const saveEditsButton = clone.querySelector('.save-button');
    saveEditsButton.classList.add('hidden');

    const cancelEditsButton = clone.querySelector('.cancel-button');
    cancelEditsButton.classList.add('hidden');
    cancelEditsButton.addEventListener('click', function () {
        disableBeanEditing(beanCard);
    });

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

    if (!isNewBean) {
        popupulateBeanCardFields(bean, beanCard);
        disableBeanEditing(beanCard);
    }

    beanCard.appendChild(form);

    return beanCard;
}

function popupulateBeanCardFields(bean, beanCard) {
    if (!bean || !beanCard) return;

    beanCard.querySelector('input[name="id"]').value = bean.id || '';
    beanCard.querySelector('input[name="name"]').value = bean.name || '';
    beanCard.querySelector('input[name="region-country"]').value = bean.regionCountry || '';
    beanCard.querySelector('input[name="altitude"]').value = bean.altitude || '';
    beanCard.querySelector('input[name="variety"]').value = bean.variety || '';
    beanCard.querySelector('input[name="process"]').value = bean.process || '';
    beanCard.querySelector('input[name="roaster"]').value = bean.roaster || '';
    beanCard.querySelector('select[name="roast-level"]').value = bean.roastLevel || '';
    
    const tastingNotesContainer = beanCard.querySelector('.tasting-notes-container');
    if (tastingNotesContainer) {
        const tastingNotes = bean.tastingNotes ? bean.tastingNotes.split(', ') : [];
        toggleTastingNotesEditable(tastingNotesContainer, false);
        selectTastingNotes(tastingNotesContainer, tastingNotes);
    }
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

function enableBeanEditing(beanCard) {
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

function disableBeanEditing(beanCard) {
    if (beanCard) {
        const inputs = beanCard.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
        });

        const tastingNotesContainer = beanCard.querySelector('.tasting-notes-container');
        if (tastingNotesContainer) {
            toggleTastingNotesEditable(tastingNotesContainer, false);
        }
        
        const bean = getBeanById(beanCard.querySelector('input[name="id"]').value);
        if (bean) {
            popupulateBeanCardFields(bean, beanCard);
        }

        const saveButton = beanCard.querySelector('.save-button');
        const cancelButton = beanCard.querySelector('.cancel-button');
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');

        const editButton = beanCard.querySelector('.edit-button');
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