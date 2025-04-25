
const tastingNotes = [
    "Chocolate",
    "Caramel",
    "Nutty",
    "Fruity",
    "Citrus",
    "Floral",
    "Spicy",
    "Earthy",
    "Sweet",
    "Savory",
    "Cocoa",
    "Brown Sugar",
    "Vanilla",
    "Vanillin",
    "Overall Sweet",
    "Black Tea",
    "Berry",
    "Dried Fruit",
    "Other Fruit",
    "Citrus Fruit",
    "Sour",
    "Alcohol/Fermented",
    "Olive Oil",
    "Raw",
    "Green/Vegetative",
    "Beany",
    "Papery/Misty",
    "Chemical",
    "Pipe Tobacco",
    "Tobacco",
    "Burnt",
    "Cereal",
    "Pungent",
    "Pepper",
    "Brown Spice",
];

export function getTastingNotesInput(preSelectedNotes) {
    const container = document.createElement('div');
    container.classList.add('tasting-notes-container');

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Type a tasting note...';
    searchBar.classList.add('tasting-notes-search');
    container.appendChild(searchBar);

    const notesListContainer = document.createElement('div');
    notesListContainer.classList.add('tasting-notes-list');

    for (const note of tastingNotes) {
        const noteElement = document.createElement('div');
        noteElement.classList.add('tasting-note');
        noteElement.textContent = note;

        if (preSelectedNotes && preSelectedNotes.includes(note)) {
            noteElement.classList.add('selected');
        }

        noteElement.addEventListener('click', handleNoteClick);

        notesListContainer.appendChild(noteElement);
    }
    container.appendChild(notesListContainer);

    searchBar.addEventListener('input', function () {
        updateSuggestions(searchBar.value, notesListContainer);
    });

    return container;
}

function handleNoteClick(event) {
    toggleNoteSelected(event.currentTarget);
}

export function toggleTastingNotesEditable(tastingNotesContainer, isEditable) {
    const searchBar = tastingNotesContainer.querySelector('.tasting-notes-search');
    if (isEditable) {
        searchBar.classList.remove('hidden');
    } else {
        searchBar.classList.add('hidden');
    }

    const notes = tastingNotesContainer.querySelectorAll('.tasting-note');
    notes.forEach(note => {
        if (isEditable) {
            enableNote(note);
            showNote(note);
        } else {
            disableNote(note);
            if (isNoteSelected(note)) showNote(note);
            else hideNote(note);
        }
    });
}

function isNoteDisabled(note) {
    return note.classList.contains('disabled');
}

function disableNote(note) {
    note.classList.add('disabled');
    note.removeEventListener('click', handleNoteClick);
}

function enableNote(note) {
    note.classList.remove('disabled');
    note.addEventListener('click', handleNoteClick);
}

function updateSuggestions(query, notesListContainer) {
    const notes = notesListContainer.querySelectorAll('.tasting-note');
    notes.forEach(note => {
        if (note.textContent.toLowerCase().includes(query.toLowerCase())) {
            showNote(note);
        } else {
            hideNote(note);
        }
    });
}

function toggleNoteSelected(noteElement) {
    noteElement.classList.toggle('selected');
}

function hideNote(note) {
    note.classList.add('hidden');
}

function showNote(note) {
    note.classList.remove('hidden');
}

function isNoteSelected(note) {
    return note.classList.contains('selected');
}

export function getSelectedTastingNotes(notesContainer) {
    const selectedNotes = Array.from(notesContainer.querySelectorAll('.tasting-note.selected')).map(note => note.textContent);
    return selectedNotes.length > 0 ? selectedNotes : null;
}