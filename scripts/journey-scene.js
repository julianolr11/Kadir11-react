console.log('journey-scene.js carregado');

function closeWindow() {
    window.close();
}

function assetPath(relative) {
    if (!relative) return '';
    return relative.startsWith('Assets/') ? relative : `Assets/Mons/${relative}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('scene-bg');
    const player = document.getElementById('player-pet');
    const enemy = document.getElementById('enemy-pet');
    const playerFront = document.getElementById('player-front');
    const enemyFront = document.getElementById('enemy-front');
    const enemyName = document.getElementById('enemy-name');

    document.getElementById('close-journey-scene')?.addEventListener('click', closeWindow);
    document.getElementById('back-journey-scene')?.addEventListener('click', () => {
        window.electronAPI.send('open-journey-mode-window');
        closeWindow();
    });

    window.electronAPI.on('scene-data', (event, data) => {
        if (data.background && bg) bg.src = data.background;
        if (data.playerPet && player) player.src = assetPath(data.playerPet);
        if (data.enemyPet && enemy) enemy.src = assetPath(data.enemyPet);

        if (data.playerPet && playerFront) {
            const frontPath = data.playerPet.replace(/idle\.gif$/i, 'front.gif');
            playerFront.src = assetPath(frontPath);
        }

        if (data.enemyPet && enemyFront) {
            const frontPath = data.enemyPet.replace(/idle\.gif$/i, 'front.gif');
            enemyFront.src = assetPath(frontPath);
        }

        if (data.enemyName && enemyName) enemyName.textContent = data.enemyName;
    });
});
