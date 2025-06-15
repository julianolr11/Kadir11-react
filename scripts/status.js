import { rarityGradients } from './constants.js';
console.log('status.js carregado com sucesso');

let pet = {};

function formatRarity(rarity) {
    if (!rarity) return 'Desconhecida';
    return rarity
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
}

function loadPet(petData) {
    if (petData) {
        pet = petData;
        console.log('Pet recebido via IPC na janela de status:', pet);
    } else {
        console.error('Nenhum petData recebido via IPC');
    }
    updateStatus();
}

function updateStatus() {
    // Elementos do DOM
    const healthContainer = document.getElementById('health');
    const hungerContainer = document.getElementById('hunger');
    const happinessContainer = document.getElementById('happiness');
    const energyContainer = document.getElementById('energy');
    const statusAttack = document.getElementById('status-attack');
    const statusDefense = document.getElementById('status-defense');
    const statusSpeed = document.getElementById('status-speed');
    const statusMagic = document.getElementById('status-magic');
    const statusRarityLabel = document.getElementById('status-rarity-label');
    const statusHealthFill = document.getElementById('status-health-fill');
    const statusHungerFill = document.getElementById('status-hunger-fill');
    const statusHappinessFill = document.getElementById('status-happiness-fill');
    const statusEnergyFill = document.getElementById('status-energy-fill');
    const statusLevel = document.getElementById('status-level');
    const statusMoves = document.getElementById('status-moves');
    const statusPetImage = document.getElementById('status-pet-image');
    const titleBarElement = document.getElementById('title-bar-element');
    const titleBarPetName = document.getElementById('title-bar-pet-name');
    const statusPetImageGradient = document.getElementById('status-pet-image-gradient');

    // Verificar se todos os elementos estão disponíveis
    if (!healthContainer || !hungerContainer || !happinessContainer || !energyContainer || !statusAttack || !statusDefense || !statusSpeed || !statusMagic || !statusRarityLabel || !statusHealthFill || !statusHungerFill || !statusHappinessFill || !statusEnergyFill || !statusLevel || !statusMoves || !statusPetImage || !titleBarElement || !titleBarPetName || !statusPetImageGradient) {
        console.error('Um ou mais elementos do status-container ou title-bar não encontrados', {
            healthContainer: !!healthContainer,
            hungerContainer: !!hungerContainer,
            happinessContainer: !!happinessContainer,
            energyContainer: !!energyContainer,
            statusAttack: !!statusAttack,
            statusDefense: !!statusDefense,
            statusSpeed: !!statusSpeed,
            statusMagic: !!statusMagic,
            statusRarityLabel: !!statusRarityLabel,
            statusHealthFill: !!statusHealthFill,
            statusHungerFill: !!statusHungerFill,
            statusHappinessFill: !!statusHappinessFill,
            statusEnergyFill: !!statusEnergyFill,
            statusLevel: !!statusLevel,
            statusMoves: !!statusMoves,
            statusPetImage: !!statusPetImage,
            titleBarElement: !!titleBarElement,
            titleBarPetName: !!titleBarPetName,
            statusPetImageGradient: !!statusPetImageGradient
        });
        return;
    }

    // Acessar os elementos filhos dentro dos contêineres
    const statusHealth = healthContainer.querySelector('#status-health');
    const statusHunger = hungerContainer.querySelector('#status-hunger');
    const statusHappiness = happinessContainer.querySelector('#status-happiness');
    const statusEnergy = energyContainer.querySelector('#status-energy');

    // Verificar se os dados do pet estão disponíveis
    if (!pet || !pet.element || !pet.rarity) {
        console.error('Dados do pet incompletos:', pet);
        return;
    }

    // Atualizar os elementos do DOM
    statusHealth.textContent = `${pet.currentHealth || 0}/${pet.maxHealth || 0}`;
    statusHunger.textContent = `${pet.hunger || 0}/100`;
    statusHappiness.textContent = `${pet.happiness || 0}/100`;
    statusEnergy.textContent = `${pet.energy || 0}/100`;
    statusAttack.textContent = pet.attributes?.attack || 0;
    statusDefense.textContent = pet.attributes?.defense || 0;
    statusSpeed.textContent = pet.attributes?.speed || 0;
    statusMagic.textContent = pet.attributes?.magic || 0;
    statusRarityLabel.textContent = formatRarity(pet.rarity).toUpperCase();
    statusLevel.innerHTML = `<strong>Level: ${pet.level || 0}</strong>`;

    // Atualizar a imagem do elemento na barra de título
    const elementImages = {
        'ar': './assets/elements/ar.png',
        'fogo': './assets/elements/fogo.png',
        'agua': './assets/elements/agua.png',
        'terra': './assets/elements/terra.png',
        'puro': './assets/elements/puro.png'
    };
    const elementImageSrc = elementImages[pet.element.toLowerCase()] || './assets/elements/default.png';
    console.log('Atualizando elemento na barra de título:', elementImageSrc);
    titleBarElement.src = elementImageSrc;
    titleBarElement.alt = `Elemento: ${pet.element}`;

    // Atualizar o nome do pet na barra de título
    console.log('Atualizando nome na barra de título:', pet.name);
    titleBarPetName.textContent = pet.name;

    // Atualizar a lista de golpes
    statusMoves.innerHTML = '';
    if (pet.moves && pet.moves.length > 0) {
        const moveList = document.createElement('ul');
        pet.moves.forEach(move => {
            const moveItem = document.createElement('li');
            moveItem.textContent = move.name;
            moveList.appendChild(moveItem);
        });
        statusMoves.appendChild(moveList);
    } else {
        statusMoves.textContent = 'Nenhum golpe aprendido.';
    }

    const healthPercentage = (pet.currentHealth || 0) / (pet.maxHealth || 1) * 100;
    statusHealthFill.style.width = `${healthPercentage}%`;
    statusHungerFill.style.width = `${pet.hunger || 0}%`;
    statusHappinessFill.style.width = `${pet.happiness || 0}%`;
    statusEnergyFill.style.width = `${pet.energy || 0}%`;

    // Aplicar gradiente com base na raridade apenas na área da imagem do pet
    const gradient = rarityGradients[pet.rarity] || 'linear-gradient(135deg, #808080, #A9A9A9)';
    console.log('Aplicando gradiente:', gradient);
    statusPetImageGradient.style.background = gradient;

    // Atualizar a imagem do pet
    statusPetImage.addEventListener('load', () => {
        console.log('Imagem do pet carregada com sucesso');
    });
    statusPetImage.addEventListener('error', (e) => {
        console.error('Erro ao carregar a imagem do pet:', e);
        statusPetImage.src = 'assets/mons/eggsy.png'; // Fallback ajustado pro caminho correto
    });
    statusPetImage.src = pet.image ? `assets/mons/${pet.image}` : 'assets/mons/eggsy.png';
}

function closeWindow() {
    console.log('Botão Fechar clicado na janela de status');
    window.close();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado na janela de status');

    // Controle das abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Remover a classe active de todas as abas e botões
            document.querySelectorAll('.tab-content-item').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Adicionar a classe active à aba e botão selecionados
            document.getElementById(tabId)?.classList.add('active');
            button.classList.add('active');
        });
    });

    // Garantir que a aba "Status" seja a inicial
    const statusTabButton = document.querySelector('.tab-button[data-tab="tab-status"]');
    if (statusTabButton) {
        statusTabButton.click();
    } else {
        console.warn('Botão da aba Status não encontrado');
    }

    // Adicionar evento ao botão "Reaprender Golpes" (placeholder)
    const relearnMovesButton = document.getElementById('relearn-moves-button');
    if (relearnMovesButton) {
        relearnMovesButton.addEventListener('click', () => {
            console.log('Botão Reaprender Golpes clicado, abrindo janela de treinamento');
            // Placeholder para funcionalidade futura
        });
    } else {
        console.warn('relearn-moves-button element not found');
    }

    // Registrar o listener para o evento pet-data dentro do DOMContentLoaded
    window.electronAPI.on('pet-data', (event, petData) => {
        console.log('Dados do pet recebidos via IPC:', petData);
        loadPet(petData);
    });

    // Adicionar evento ao botão de fechar
    document.getElementById('close-status-titlebar')?.addEventListener('click', closeWindow);
});