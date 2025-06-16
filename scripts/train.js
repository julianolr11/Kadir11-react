console.log('train.js carregado');

let pet = null;

function closeWindow() {
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-train-window')?.addEventListener('click', closeWindow);
    document.getElementById('back-train-window')?.addEventListener('click', () => {
        window.electronAPI.send('open-status-window');
        closeWindow();
    });

    window.electronAPI.on('pet-data', (event, data) => {
        pet = data;
        loadMoves();
    });
});

async function loadMoves() {
    try {
        const response = await fetch('data/moves.json');
        const moves = await response.json();
        renderMoves(moves);
    } catch (err) {
        console.error('Erro ao carregar golpes:', err);
    }
}

function renderMoves(moves) {
    const tbody = document.querySelector('#moves-table tbody');
    tbody.innerHTML = '';
    moves.forEach(move => {
        if (!move.elements.includes(pet.element) || !move.species.includes(pet.specie)) {
            return;
        }
        const tr = document.createElement('tr');
        let action = 'Aprender';
        const known = pet.moves && pet.moves.some(m => m.name === move.name);
        if (known) action = 'Reaprender';
        if (pet.moves && pet.moves.length >= 4 && !known) action = 'Trocar';
        if (pet.level < move.level) action = 'Indisponível';

        const elementIcons = move.elements.map(el =>
            `<img class="element-icon" src="Assets/Elements/${el}.png" alt="${el}" style="image-rendering: pixelated;">`
        ).join(' ');

        let actionClass = '';
        switch (action) {
            case 'Aprender':
                actionClass = 'action-aprender';
                break;
            case 'Reaprender':
                actionClass = 'action-reaprender';
                break;
            case 'Trocar':
                actionClass = 'action-trocar';
                break;
            default:
                actionClass = 'action-indisponivel';
        }

        tr.innerHTML = `
            <td>${move.name}</td>
            <td>${move.rarity}</td>
            <td>${elementIcons}</td>
            <td>${move.power}</td>
            <td>${move.effect}</td>
            <td>${move.cost}</td>
            <td>${move.level}</td>
            <td><button class="button small-button action-button ${actionClass}">${action}</button></td>
        `;

        const btn = tr.querySelector('button');
        if (action === 'Indisponível') {
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => {
                window.electronAPI.send('learn-move', move);
            });
        }
        tbody.appendChild(tr);
    });
}
