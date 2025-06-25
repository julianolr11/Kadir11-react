const nestsContainer = document.getElementById('nests-container');
const eggIcons = {
    eggAve: 'assets/tileset/ave_egg.png',
    eggCriaturaMistica: 'assets/tileset/criaturamistica_egg.png',
    eggCriaturaSombria: 'assets/tileset/criaturasombria_egg.png',
    eggDraconideo: 'assets/tileset/draconideo_egg.png',
    eggFera: 'assets/tileset/fera_egg.png',
    eggMonstro: 'assets/tileset/monster_egg.png',
    eggReptiloide: 'assets/tileset/reptiloide_egg.png'
};

let nestsData = [];

function drawNests(count) {
    if (!nestsContainer) return;
    nestsContainer.innerHTML = '';
    const n = Math.min(3, count || 0);
    for (let i = 0; i < n; i++) {
        const slot = document.createElement('div');
        slot.style.position = 'relative';
        const img = document.createElement('img');
        img.src = 'Assets/tileset/nest.png';
        img.className = 'nest-image';
        slot.appendChild(img);
        const egg = nestsData[i];
        if (egg) {
            const eggImg = document.createElement('img');
            eggImg.src = eggIcons[egg.eggId] || '';
            eggImg.className = 'nest-image';
            eggImg.style.position = 'absolute';
            eggImg.style.left = '0';
            eggImg.style.top = '0';
            slot.appendChild(eggImg);
        }
        nestsContainer.appendChild(slot);
    }
}

function loadNests() {
    if (!window.electronAPI) return;
    Promise.all([
        window.electronAPI.getNestCount(),
        window.electronAPI.getNestsData()
    ]).then(([count, data]) => {
        nestsData = Array.isArray(data) ? data : [];
        drawNests(count);
    });
}

window.electronAPI?.on('nest-updated', (e, count) => drawNests(count));
window.electronAPI?.on('nests-data-updated', (e, data) => {
    nestsData = Array.isArray(data) ? data : [];
    loadNests();
});
window.addEventListener('DOMContentLoaded', loadNests);
