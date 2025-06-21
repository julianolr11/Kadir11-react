console.log('journey-scene.js carregado');

function closeWindow() {
    window.close();
}

function assetPath(relative) {
    if (!relative) return '';
    const cleaned = relative.replace(/^[Aa]ssets[\/][Mm]ons[\/]/, '');
    return `Assets/Mons/${cleaned}`;
}

let pet = null;
let itemsInfo = {};
let playerHealth = 100;
let playerMaxHealth = 100;
let enemyHealth = 100;

async function loadItemsInfo() {
    try {
        const resp = await fetch('data/items.json');
        const data = await resp.json();
        itemsInfo = {};
        data.forEach(it => { itemsInfo[it.id] = it; });
    } catch (err) {
        console.error('Erro ao carregar info dos itens:', err);
    }
}

function hideMenus() {
    document.getElementById('moves-menu').style.display = 'none';
    document.getElementById('items-menu').style.display = 'none';
}

function showMessage(text) {
    const box = document.getElementById('message-box');
    if (!box) return;
    box.textContent = text;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 2000);
}

function updateMoves() {
    const menu = document.getElementById('moves-menu');
    if (!menu) return;
    menu.innerHTML = '';
    if (!pet || !Array.isArray(pet.moves)) return;
    pet.moves.forEach(move => {
        const btn = document.createElement('button');
        btn.className = 'button small-button';
        btn.textContent = move.name;
        menu.appendChild(btn);
    });
}

function updateItems() {
    const menu = document.getElementById('items-menu');
    if (!menu) return;
    menu.innerHTML = '';
    if (!pet || !pet.items) return;
    Object.keys(pet.items).forEach(id => {
        const qty = pet.items[id];
        if (qty <= 0) return;
        const info = itemsInfo[id] || { name: id };
        const btn = document.createElement('button');
        btn.className = 'button small-button';
        btn.textContent = `${info.name} x${qty}`;
        btn.addEventListener('click', () => {
            window.electronAPI.send('use-item', id);
        });
        menu.appendChild(btn);
    });
}

function attemptFlee() {
    let chance = 0.5;
    if (playerHealth >= enemyHealth) chance += 0.25; else chance -= 0.25;
    chance = Math.max(0.1, Math.min(0.9, chance));
    if (Math.random() < chance) {
        showMessage('Fuga bem-sucedida!');
        setTimeout(closeWindow, 1500);
    } else {
        showMessage('Fuga falhou!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('scene-bg');
    const player = document.getElementById('player-pet');
    const enemy = document.getElementById('enemy-pet');
    const playerFront = document.getElementById('player-front');
    const enemyFront = document.getElementById('enemy-front');
    const enemyName = document.getElementById('enemy-name');
    loadItemsInfo();

    document.getElementById('close-journey-scene')?.addEventListener('click', closeWindow);
    document.getElementById('back-journey-scene')?.addEventListener('click', () => {
        window.electronAPI.send('open-journey-mode-window');
        closeWindow();
    });

    const fightBtn = document.getElementById('fight-btn');
    const itemsBtn = document.getElementById('items-btn');
    const runBtn = document.getElementById('run-btn');

    fightBtn?.addEventListener('click', () => {
        const menu = document.getElementById('moves-menu');
        if (!menu) return;
        if (menu.style.display === 'none' || menu.style.display === '') {
            hideMenus();
            updateMoves();
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    });

    itemsBtn?.addEventListener('click', () => {
        const menu = document.getElementById('items-menu');
        if (!menu) return;
        if (menu.style.display === 'none' || menu.style.display === '') {
            hideMenus();
            updateItems();
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    });

    runBtn?.addEventListener('click', attemptFlee);

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

    window.electronAPI.on('pet-data', (event, data) => {
        if (!data) return;
        pet = data;
        playerHealth = data.currentHealth ?? playerHealth;
        playerMaxHealth = data.maxHealth ?? playerMaxHealth;
        const healthFill = document.getElementById('player-health-fill');
        const energyFill = document.getElementById('player-energy-fill');
        if (healthFill) {
            const percent = (playerHealth / playerMaxHealth) * 100;
            healthFill.style.width = `${percent}%`;
        }
        if (energyFill) {
            const percent = (data.energy || 0);
            energyFill.style.width = `${percent}%`;
        }
        updateMoves();
        updateItems();
    });
});
