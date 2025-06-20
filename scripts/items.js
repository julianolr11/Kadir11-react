let pet = null;

function closeWindow() {
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-items-window')?.addEventListener('click', closeWindow);
    document.getElementById('back-items-window')?.addEventListener('click', () => {
        window.electronAPI.send('open-status-window');
        closeWindow();
    });
    document.getElementById('open-store-button')?.addEventListener('click', () => {
        window.electronAPI.send('store-pet');
    });

    document.querySelectorAll('.use-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.dataset.item;
            window.electronAPI.send('use-item', item);
        });
    });

    window.electronAPI.on('pet-data', (event, data) => {
        pet = data;
        const countEl = document.getElementById('coin-count');
        if (countEl) countEl.textContent = pet.coins ?? 0;
        updateItems();
    });
});

function updateItems() {
    if (!pet) return;
    const items = pet.items || {};
    const map = {
        healthPotion: 'qty-healthPotion',
        meat: 'qty-meat',
        staminaPotion: 'qty-staminaPotion'
    };
    Object.keys(map).forEach(key => {
        const el = document.getElementById(map[key]);
        if (el) el.textContent = items[key] ?? 0;
    });
}
