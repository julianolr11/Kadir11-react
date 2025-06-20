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

    function positionTooltip(event) {
        let left = event.pageX + 10;
        let top = event.pageY - tooltip.offsetHeight - 10;

        if (left + tooltip.offsetWidth > window.innerWidth) {
            left = window.innerWidth - tooltip.offsetWidth - 10;
        }
        if (left < 0) {
            left = 0;
        }

        if (top < 0) {
            top = event.pageY + 10;
        }
        if (top + tooltip.offsetHeight > window.innerHeight) {
            top = window.innerHeight - tooltip.offsetHeight - 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    document.querySelectorAll('.path-point').forEach(point => {
        point.addEventListener('mouseenter', event => {
            const img = point.dataset.image;
            if (!img) return;
            tooltipImg.src = img;
            tooltipName.textContent = point.dataset.name || '';
            tooltip.style.display = 'block';
            positionTooltip(event);
        });
        point.addEventListener('mousemove', event => {
            if (tooltip.style.display !== 'block') return;
            positionTooltip(event);
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
