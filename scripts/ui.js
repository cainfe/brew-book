import { clearData } from './storage.js';

export function initialize() {
    document.getElementById('delete-data').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete all brew and bean data?')) {
            clearData();
            location.reload();
        }
    });
}
