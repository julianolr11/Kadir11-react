let pet = null;

function closeWindow() {
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-store-window')?.addEventListener('click', closeWindow);
    document.getElementById('back-store-window')?.addEventListener('click', () => {
        window.electronAPI.send('open-status-window');
        closeWindow();
    });

    document.querySelectorAll('.buy-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.dataset.item;
            window.electronAPI.send('buy-item', item);
        });
    });

    window.electronAPI.on('pet-data', (event, data) => {
        pet = data;
        const countEl = document.getElementById('store-coin-count');
        if (countEl) countEl.textContent = pet.coins ?? 0;
    });

    window.electronAPI.on('show-store-error', (event, message) => {
        const alertEl = document.getElementById('store-alert');
        if (alertEl) {
            alertEl.textContent = message || 'Erro desconhecido';
            alertEl.style.display = 'block';
            setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
        } else {
            alert(message);
        }
    });
});
