import { importData, exportData, clearData } from './storage.js';

export function initialize() {
    document.getElementById('delete-data').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete all brew and bean data?')) {
            clearData();
            location.reload();
        }
    });

    document.getElementById('export-data').addEventListener('click', function () {
        const data = exportData();

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'brew-book-data.json';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    document.getElementById('import-data-button').addEventListener('click', function () {
        if (!confirm('Importing data will overwrite your current brews and beans. Are you sure you want to proceed?')) {
            return;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        importData(e.target.result);
                        location.reload();
                    } catch (error) {
                        alert('Failed to import data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            } else {
                alert('No file selected for import.');
            }
        };

        fileInput.click();
    });
}
