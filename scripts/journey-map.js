console.log('journey-map.js carregado');

function closeWindow() {
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-journey-mode')?.addEventListener('click', closeWindow);
    document.getElementById('back-journey-mode')?.addEventListener('click', () => {
        window.electronAPI?.send('open-battle-mode-window');
        window.close();
    });

    const tooltip = document.getElementById('map-tooltip');
    const tooltipImg = tooltip.querySelector('img');
    const tooltipName = tooltip.querySelector('.tooltip-name');

    document.querySelectorAll('.path-point').forEach(point => {
        point.addEventListener('mouseenter', event => {
            const img = point.dataset.image;
            if (!img) return;
            tooltipImg.src = img;
            tooltipName.textContent = point.dataset.name || '';
            tooltip.style.display = 'block';
            const left = event.pageX + 10;
            const top = event.pageY - tooltip.offsetHeight - 10;
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });
        point.addEventListener('mousemove', event => {
            if (tooltip.style.display !== 'block') return;
            const left = event.pageX + 10;
            const top = event.pageY - tooltip.offsetHeight - 10;
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });
        point.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
            tooltipName.textContent = '';
        });
        point.addEventListener('click', () => {
            const img = point.dataset.image;
            if (img) {
                window.electronAPI?.send('open-journey-scene-window', { background: img });
            }
        });
    });
});
