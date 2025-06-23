console.log('Script do start.js carregado');
console.log('window.electronAPI disponível:', typeof window.electronAPI !== 'undefined');

if (!window.electronAPI) {
    console.error('Erro crítico: window.electronAPI não está disponível. Verifique se o preload.js foi carregado corretamente.');
    alert('Erro: Não foi possível carregar a API do Electron. Verifique o console para mais detalhes.');
}

// Controle da música de fundo
const backgroundMusic = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');

if (backgroundMusic && muteButton) {
    // Definir volume inicial (0.3 = 30% do volume máximo)
    backgroundMusic.volume = 0.3;
    console.log('Volume inicial da música definido para:', backgroundMusic.volume);

    // Carregar o estado de mute via IPC
    let isMuted = false;
    window.electronAPI.getMuteState().then(state => {
        isMuted = state;
        backgroundMusic.muted = isMuted;
        console.log('Estado inicial de mute carregado via IPC:', isMuted);
        updateMuteButton();
    }).catch(err => {
        console.error('Erro ao carregar o estado de mute via IPC:', err);
        updateMuteButton();
    });

    // Função para atualizar o ícone do botão
    function updateMuteButton() {
        muteButton.textContent = isMuted ? '🔇' : '🔊';
    }

    // Evento de clique no botão de mute
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        // Salvar o estado via IPC
        window.electronAPI.send('set-mute-state', isMuted);
        console.log(`Música ${isMuted ? 'mutada' : 'desmutada'} - Estado enviado via IPC`);
        updateMuteButton();
    });

    function fadeOutAndClose() {
        let vol = backgroundMusic.volume;
        const step = vol / 20;
        const interval = setInterval(() => {
            vol -= step;
            if (vol <= 0) {
                clearInterval(interval);
                backgroundMusic.volume = 0;
                backgroundMusic.pause();
                window.electronAPI.send('close-start-window');
            } else {
                backgroundMusic.volume = vol;
            }
        }, 100);
    }

    window.electronAPI.on('fade-out-start-music', fadeOutAndClose);
} else {
    console.error('Elementos de áudio ou botão de mute não encontrados');
}

// Eventos dos botões
const limitOverlay = document.getElementById('limit-overlay');
const limitOkBtn = document.getElementById('limit-ok');
let petLimit = 3;
if (window.electronAPI && window.electronAPI.getPenInfo) {
    window.electronAPI.getPenInfo().then(info => {
        petLimit = info.maxPets;
        const msg = document.getElementById('limit-message');
        if (msg) msg.textContent = `Você atingiu o limite de ${petLimit} pets. Exclua um pet para criar outro.`;
    });
}

document.getElementById('start-button').addEventListener('click', () => {
    console.log('Botão Iniciar clicado');
    if (window.electronAPI) {
        window.electronAPI.listPets().then(pets => {
            if (pets.length >= petLimit) {
                if (limitOverlay) limitOverlay.style.display = 'flex';
            } else {
                console.log('Enviando open-create-pet-window');
                window.electronAPI.send('open-create-pet-window');
            }
        }).catch(err => {
            console.error('Erro ao listar pets:', err);
        });
    } else {
        console.error('electronAPI não está disponível para enviar open-create-pet-window');
    }
});

limitOkBtn?.addEventListener('click', () => {
    if (limitOverlay) limitOverlay.style.display = 'none';
});

document.getElementById('load-button').addEventListener('click', () => {
    console.log('Botão Carregar clicado');
    if (window.electronAPI) {
        console.log('Enviando open-load-pet-window');
        window.electronAPI.send('open-load-pet-window');
    } else {
        console.error('electronAPI não está disponível para enviar open-load-pet-window');
    }
});

const exitOverlay = document.getElementById('exit-confirm-overlay');
const exitYesBtn = document.getElementById('exit-confirm-yes');
const exitNoBtn = document.getElementById('exit-confirm-no');

document.getElementById('exit-button').addEventListener('click', () => {
    console.log('Botão Sair clicado');
    if (exitOverlay) {
        exitOverlay.style.display = 'flex';
    }
});

exitYesBtn?.addEventListener('click', () => {
    if (window.electronAPI) {
        console.log('Enviando exit-app');
        window.electronAPI.send('exit-app');
    } else {
        console.error('electronAPI não está disponível para enviar exit-app');
    }
});

exitNoBtn?.addEventListener('click', () => {
    if (exitOverlay) {
        exitOverlay.style.display = 'none';
    }
});

// Verificar se há pets salvos e mostrar o botão "Carregar"
if (window.electronAPI) {
    console.log('Listando pets...');
    window.electronAPI.listPets().then(pets => {
        console.log('Pets recebidos:', pets);
        if (pets.length > 0) {
            document.getElementById('load-button').style.display = 'block';
        }
    }).catch(err => {
        console.error('Erro ao listar pets:', err);
    });
} else {
    console.error('electronAPI não está disponível para listar pets');
}