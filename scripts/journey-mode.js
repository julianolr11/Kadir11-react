console.log('journey-mode.js carregado');

let petLevel = 1;

function closeWindow() {
    console.log('Botão Fechar clicado na janela de jornada');
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-journey-mode')?.addEventListener('click', closeWindow);
    document.getElementById('back-journey-mode')?.addEventListener('click', () => {
        window.electronAPI.send('open-battle-mode-window');
        window.close();
    });

    const loading = document.getElementById('loading');
    const grid = document.getElementById('missions-grid');

    window.electronAPI.getJourneyImages().then(files => {
        const missions = files.map((img, idx) => {
            const base = img.split(/[\\/]/).pop().replace(/\.[^.]+$/, '');
            const formatted = base.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const min = idx * 5 + 1;
            const range = `${min}~${min + 4}`;
            return { name: formatted, range, minLevel: min, image: img };
        });

        missions.forEach(mission => {
            const tile = document.createElement('div');
            tile.className = 'mission-tile';
            const imgPath = mission.image.replace(/\\/g, '/');
            tile.style.backgroundImage = `url('${imgPath}')`;
            tile.dataset.minLevel = mission.minLevel;

            const info = document.createElement('div');
            info.className = 'mission-info';
            info.innerHTML = `<div>${mission.name}</div><div>Nível ${mission.range}</div>`;
            tile.appendChild(info);

            const lock = document.createElement('div');
            lock.className = 'lock-overlay';
            lock.textContent = '🔒';
            tile.appendChild(lock);

            grid.appendChild(tile);
        });

        if (loading) loading.style.display = 'none';

        updateLocks();

        const container = document.getElementById('journey-container');
        const titleBar = document.getElementById('title-bar');
        const totalWidth = container.scrollWidth + 10; // small padding
        const totalHeight = titleBar.offsetHeight + container.scrollHeight + 10;
        window.electronAPI.send('resize-journey-window', { width: totalWidth, height: totalHeight });
    });
});

function updateLocks() {
    document.querySelectorAll('.mission-tile').forEach(tile => {
        const required = parseInt(tile.dataset.minLevel, 10);
        if (petLevel < required) {
            tile.classList.add('locked');
        } else {
            tile.classList.remove('locked');
        }
    });
}

window.electronAPI.on('pet-data', (event, petData) => {
    if (petData && petData.level) {
        petLevel = petData.level;
        updateLocks();
    }
});
