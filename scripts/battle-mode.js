console.log('battle-mode.js carregado com sucesso');

function closeWindow() {
    console.log('Botão Fechar clicado na janela de modo de batalha');
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado na janela de modo de batalha');

    // Adicionar evento ao botão de fechar
    document.getElementById('close-battle-mode')?.addEventListener('click', closeWindow);

    // Adicionar eventos pras divs de modo
    const modeJourney = document.getElementById('mode-journey');
    const modePlaceholder1 = document.getElementById('mode-placeholder1');
    const modePlaceholder2 = document.getElementById('mode-placeholder2');

    if (modeJourney) {
        modeJourney.addEventListener('click', () => {
            console.log('Modo Jornada selecionado');
            // Lógica futura pra modo Jornada
            window.close(); // Fecha a janela por enquanto
        });
    }

    if (modePlaceholder1) {
        modePlaceholder1.addEventListener('click', () => {
            console.log('Modo Placeholder 1 selecionado (futuro)');
            window.close(); // Fecha a janela por enquanto
        });
    }

    if (modePlaceholder2) {
        modePlaceholder2.addEventListener('click', () => {
            console.log('Modo Placeholder 2 selecionado (futuro)');
            window.close(); // Fecha a janela por enquanto
        });
    }
});