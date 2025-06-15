console.log('journey-mode.js carregado');

let petLevel = 1;

function closeWindow() {
    console.log('Botão Fechar clicado na janela de jornada');
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-journey-mode')?.addEventListener('click', closeWindow);

    const missions = [
        { name: 'Bosque Sombrio', range: '1~3', minLevel: 1, image: 'Assets/Modes/Journeys/forest.jpg' },
        { name: 'Lago Sereno', range: '4~7', minLevel: 4, image: 'Assets/Modes/Journeys/lake.jpg' },
        { name: 'Montanha Sagrada', range: '8~11', minLevel: 8, image: 'Assets/Modes/Journeys/mountain.jpg' },
        { name: 'Abismo Profundo', range: '12~15', minLevel: 12, image: 'Assets/Modes/Journeys/abyss.jpg' },
        { name: 'Bosque Místico', range: '16~19', minLevel: 16, image: 'Assets/Modes/Journeys/forest.jpg' },
        { name: 'Lago Congelado', range: '20~23', minLevel: 20, image: 'Assets/Modes/Journeys/lake.jpg' },
        { name: 'Montanha Ardente', range: '24~27', minLevel: 24, image: 'Assets/Modes/Journeys/mountain.jpg' },
        { name: 'Abismo das Sombras', range: '28~31', minLevel: 28, image: 'Assets/Modes/Journeys/abyss.jpg' },
        { name: 'Bosque Encantado', range: '32~35', minLevel: 32, image: 'Assets/Modes/Journeys/forest.jpg' },
        { name: 'Lago Esmeralda', range: '36~39', minLevel: 36, image: 'Assets/Modes/Journeys/lake.jpg' },
        { name: 'Montanha dos Ventos', range: '40~43', minLevel: 40, image: 'Assets/Modes/Journeys/mountain.jpg' },
        { name: 'Abismo Eterno', range: '44~47', minLevel: 44, image: 'Assets/Modes/Journeys/abyss.jpg' },
        { name: 'Bosque dos Anciões', range: '48~51', minLevel: 48, image: 'Assets/Modes/Journeys/forest.jpg' },
        { name: 'Lago Dourado', range: '52~55', minLevel: 52, image: 'Assets/Modes/Journeys/lake.jpg' },
        { name: 'Montanha Celeste', range: '56~59', minLevel: 56, image: 'Assets/Modes/Journeys/mountain.jpg' },
        { name: 'Abismo Infinito', range: '60~63', minLevel: 60, image: 'Assets/Modes/Journeys/abyss.jpg' },
        { name: 'Bosque Gélido', range: '64~67', minLevel: 64, image: 'Assets/Modes/Journeys/forest.jpg' },
        { name: 'Lago das Névoas', range: '68~71', minLevel: 68, image: 'Assets/Modes/Journeys/lake.jpg' },
        { name: 'Montanha Selvagem', range: '72~75', minLevel: 72, image: 'Assets/Modes/Journeys/mountain.jpg' },
        { name: 'Abismo do Fim', range: '76~79', minLevel: 76, image: 'Assets/Modes/Journeys/abyss.jpg' }
    ];

    const grid = document.getElementById('missions-grid');
    missions.forEach(mission => {
        const tile = document.createElement('div');
        tile.className = 'mission-tile';
        tile.style.backgroundImage = `url('${mission.image}')`;
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

    updateLocks();
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
