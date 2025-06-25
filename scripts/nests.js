const nestsContainer = document.getElementById('nests-container');

function drawNests(count) {
    if (!nestsContainer) return;
    nestsContainer.innerHTML = '';
    const n = Math.min(3, count || 0);
    for (let i = 0; i < n; i++) {
        const img = document.createElement('img');
        img.src = 'Assets/tileset/nest.png';
        img.className = 'nest-image';
        nestsContainer.appendChild(img);
    }
}

function loadNests() {
    if (window.electronAPI && window.electronAPI.getNestCount) {
        window.electronAPI.getNestCount().then(drawNests);
    }
}

window.electronAPI?.on('nest-updated', (e, count) => drawNests(count));
window.addEventListener('DOMContentLoaded', loadNests);
