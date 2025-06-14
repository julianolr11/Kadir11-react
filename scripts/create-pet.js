console.log('Script do create-pet.js carregado');

// Mapeamento de espécies para imagens
const specieImages = {
    'Draconídeo': 'draconideo/draconideo.png',
    'Reptilóide': 'reptiloide/reptiloide.png',
    'Ave': 'ave/ave.png',
    'Criatura Mística': 'criaturamistica/criaturamistica.png',
    'Criatura Sombria': 'criaturasombria/criaturasombria.png',
    'Monstro': 'monstro/monstro.png',
    'Fera': 'fera/fera.png'
};

// Lista de 20 perguntas com 3 alternativas cada, e pontuações para os atributos
const questions = [
    {
        text: "Você está perdido em uma floresta. O que você faz?",
        options: [
            { text: "Procuro um rio para seguir", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Escalo uma árvore para me orientar", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
            { text: "Construo um abrigo e espero ajuda", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
        ],
    },
    {
        text: "Um estranho se aproxima. Qual é sua reação?",
        options: [
            { text: "Fico em guarda e observo", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 0 } },
            { text: "Saúdo amigavelmente", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Me escondo rapidamente", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra um artefato brilhante. O que faz?",
        options: [
            { text: "Toco para ver o que acontece", points: { attack: 1, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Estudo de longe", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Ignoro e sigo em frente", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Está escurecendo. Como você se prepara?",
        options: [
            { text: "Acendo uma fogueira", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Procuro um lugar seguro", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Continuo andando", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você ouve um rugido à distância. O que faz?",
        options: [
            { text: "Vou investigar", points: { attack: 1, defense: 0, speed: 0, magic: 0, life: 0 } },
            { text: "Fico quieto e observo", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Corro na direção oposta", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra uma caverna misteriosa. O que faz?",
        options: [
            { text: "Entro para explorar", points: { attack: 1, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Observo de fora", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Passo longe dela", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Está chovendo forte. Qual é sua atitude?",
        options: [
            { text: "Aproveito para descansar", points: { attack: 0, defense: 0, speed: 0, magic: 0, life: 1 } },
            { text: "Procuro abrigo", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Continuo minha jornada", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra um lago cristalino. O que faz?",
        options: [
            { text: "Mergulho para nadar", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 1 } },
            { text: "Bebo a água", points: { attack: 0, defense: 0, speed: 0, magic: 0, life: 1 } },
            { text: "Sigo meu caminho", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Um pássaro gigante voa sobre você. O que faz?",
        options: [
            { text: "Tento chamar sua atenção", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Me escondo", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 0 } },
            { text: "Observo de longe", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
        ],
    },
    {
        text: "Você encontra uma planta estranha. O que faz?",
        options: [
            { text: "Toco para sentir", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Estudo sem tocar", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Evito e sigo em frente", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você sente um tremor. O que faz?",
        options: [
            { text: "Corro para um lugar aberto", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
            { text: "Procuro algo para me proteger", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Fico parado e observo", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
        ],
    },
    {
        text: "Você encontra um caminho bifurcado. Qual escolhe?",
        options: [
            { text: "O caminho escuro e misterioso", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "O caminho iluminado e tranquilo", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "O caminho estreito e rápido", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você ouve um som estranho. O que faz?",
        options: [
            { text: "Investigo a origem", points: { attack: 1, defense: 0, speed: 0, magic: 0, life: 0 } },
            { text: "Fico alerta mas não me movo", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Saio rapidamente", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra uma pedra brilhante. O que faz?",
        options: [
            { text: "Pego para examinar", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Observo sem tocar", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Deixo para trás", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Está muito quente. Como você reage?",
        options: [
            { text: "Procuro sombra", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Continuo andando", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
            { text: "Tento encontrar água", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
        ],
    },
    {
        text: "Você encontra um animal ferido. O que faz?",
        options: [
            { text: "Tento ajudar", points: { attack: 0, defense: 0, speed: 0, magic: 0, life: 1 } },
            { text: "Observo de longe", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Sigo meu caminho", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você vê um arco-íris. O que faz?",
        options: [
            { text: "Tento seguir até o fim", points: { attack: 0, defense: 0, speed: 1, magic: 1, life: 0 } },
            { text: "Aprecio a vista", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Ignoro e sigo em frente", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra uma ponte quebrada. O que faz?",
        options: [
            { text: "Tento atravessar com cuidado", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
            { text: "Procuro outro caminho", points: { attack: 0, defense: 1, speed: 0, magic: 0, life: 1 } },
            { text: "Construo algo para atravessar", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
        ],
    },
    {
        text: "Você vê uma estrela cadente. O que faz?",
        options: [
            { text: "Faço um pedido", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Observo em silêncio", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 0 } },
            { text: "Sigo meu caminho", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
    {
        text: "Você encontra um mapa antigo. O que faz?",
        options: [
            { text: "Sigo o mapa", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
            { text: "Guardo para estudar depois", points: { attack: 0, defense: 0, speed: 0, magic: 1, life: 1 } },
            { text: "Ignoro o mapa", points: { attack: 0, defense: 0, speed: 1, magic: 0, life: 0 } },
        ],
    },
];

// Função para gerar a raridade
function generateRarity() {
    const roll = Math.floor(Math.random() * 100);
    if (roll < 40) return "Comum";
    if (roll < 70) return "Incomum";
    if (roll < 85) return "Raro";
    if (roll < 95) return "MuitoRaro";
    if (roll < 99) return "Epico";
    return "Lendario";
}

// Função ajustada para definir a espécie de forma mais aleatória
function generateSpecie(attributes) {
    const { attack, defense, speed, magic, life } = attributes;

    // Lista de todas as espécies
    const species = ["Draconídeo", "Reptilóide", "Ave", "Criatura Mística", "Criatura Sombria", "Monstro", "Fera"];

    // Calcular um "peso" baseado nos atributos pra influenciar levemente a escolha
    const weights = {
        "Draconídeo": attack + magic,           // Favorece ataque e magia
        "Reptilóide": defense + speed,         // Favorece defesa e velocidade
        "Ave": speed + magic,                  // Favorece velocidade e magia
        "Criatura Mística": magic + life,      // Favorece magia e vida
        "Criatura Sombria": attack + magic,    // Favorece ataque e magia (leve variação)
        "Monstro": defense + life,             // Favorece defesa e vida
        "Fera": attack + defense               // Favorece ataque e defesa
    };

    // Gerar uma pontuação base aleatória pra cada espécie (0 a 10)
    const scores = species.map(specie => {
        const baseScore = Math.floor(Math.random() * 10); // Aleatoriedade base
        const attributeBonus = weights[specie] || 0;      // Bônus dos atributos
        return { specie, score: baseScore + Math.min(attributeBonus, 5) }; // Limita o bônus a 5 pra equilibrar
    });

    // Ordenar por pontuação (maior primeiro) e pegar a vencedora
    scores.sort((a, b) => b.score - a.score);
    console.log('Scores das espécies:', scores); // Debug pra ver as pontuações

    return scores[0].specie; // Retorna a espécie com maior pontuação
}

// Estado do quiz
let currentQuestionIndex = 0;
const selectedQuestions = [];
const stats = { attack: 1, defense: 1, speed: 1, magic: 1, life: 1 }; // Inicializa com 1
const totalQuestions = 5;

// Selecionar 5 perguntas aleatoriamente
function selectRandomQuestions() {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, totalQuestions);
}

// Exibir a pergunta atual
function showQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById('question-title').textContent = `Pergunta ${currentQuestionIndex + 1}/${totalQuestions}`;
    document.getElementById('question-text').textContent = question.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'button option-button';
        button.textContent = option.text;
        button.addEventListener('click', () => selectOption(option.points));
        optionsContainer.appendChild(button);
    });
}

// Selecionar uma opção e atualizar os atributos
function selectOption(points) {
    stats.attack += points.attack;
    stats.defense += points.defense;
    stats.speed += points.speed;
    stats.magic += points.magic;
    stats.life += points.life;

    currentQuestionIndex++;

    if (currentQuestionIndex < totalQuestions) {
        showQuestion();
    } else {
        showElementSelection();
    }
}

// Exibir a seleção de elemento
function showElementSelection() {
    document.getElementById('question-title').style.display = 'none';
    document.getElementById('question-text').style.display = 'none';
    document.getElementById('options-container').style.display = 'none';
    document.getElementById('element-selection').style.display = 'block';

    const elementButtons = document.querySelectorAll('.element-button');
    elementButtons.forEach(button => {
        const label = button.querySelector('.element-label');
        const element = button.getAttribute('data-element');
        label.textContent = element.charAt(0).toUpperCase() + element.slice(1); // Capitalizar o nome

        button.addEventListener('click', () => {
            const element = button.getAttribute('data-element');
            showNameSelection(element);
        });
    });
}

// Exibir a animação final e revelar o pet
function showFinalAnimation(newPet) {
    const finalAnimation = document.getElementById('final-animation');
    const finalAnimationGif = document.getElementById('final-animation-gif');
    
    finalAnimation.style.display = 'flex';
    console.log('Exibindo animação final');

    // Fade-in do GIF
    setTimeout(() => {
        finalAnimationGif.style.opacity = '1';
    }, 100); // Pequeno delay pra garantir que o display: flex tenha efeito

    setTimeout(() => {
        finalAnimation.style.display = 'none';
        finalAnimationGif.style.opacity = '0'; // Resetar a opacidade pra próxima vez
        console.log('Animação final concluída');

        // Após o GIF, revelar o pet com fade-in
        const petReveal = document.getElementById('pet-reveal');
        const petImage = document.getElementById('pet-image');
        const petMessage = document.getElementById('pet-message');

        petImage.src = `assets/mons/${newPet.image}`; // Caminho da imagem do pet
        petMessage.textContent = `Parabéns! Você adquiriu ${newPet.name}`;
        petReveal.style.display = 'flex';

        // Fade-in da imagem e mensagem
        setTimeout(() => {
            petImage.style.opacity = '1';
            petMessage.style.opacity = '1';

            // Após o fade-in, aplicar o efeito "pop out!"
            setTimeout(() => {
                petImage.style.transition = 'transform 0.3s ease-in-out';
                petImage.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    petImage.style.transform = 'scale(1)';
                }, 300); // Volta ao tamanho normal após 0.3s

                // Após o pop out, esperar um pouco e redirecionar
                setTimeout(() => {
                    petReveal.style.display = 'none';
                    window.electronAPI.animationFinished();
                }, 3000); // 3 segundos pra apreciar o pet antes de redirecionar
            }, 1000); // 1 segundo após o fade-in pro pop out
        }, 100); // Pequeno delay pra garantir que o display: flex tenha efeito
    }, 7000); // Duração do GIF
}

// Exibir a seleção de nome
function showNameSelection(element) {
    document.getElementById('element-selection').style.display = 'none';
    document.getElementById('name-selection').style.display = 'block';

    document.getElementById('create-pet-button').addEventListener('click', () => {
        const name = document.getElementById('pet-name').value.trim();
        if (!name) {
            alert('Por favor, insira um nome para o pet!');
            return;
        }
        if (name.length > 15) {
            alert('O nome do pet deve ter no máximo 15 caracteres!');
            return;
        }

        // Desabilitar o botão "Criar" pra evitar cliques múltiplos
        document.getElementById('create-pet-button').disabled = true;

        // Esconder a seção de nomeação
        document.getElementById('name-selection').style.display = 'none';

        // Multiplicar a vida por 10
        stats.life *= 10;

        // Gerar espécie e raridade
        const specie = generateSpecie(stats);
        const rarity = generateRarity();

        // Definir a imagem com base na espécie
        const image = specieImages[specie] || 'eggsy.png';

        const petData = {
            name,
            element,
            attributes: stats,
            specie,
            rarity,
            level: 1,
            experience: 0,
            createdAt: new Date().toISOString(),
            image,
            hunger: 100,
            happiness: 100,
            currentHealth: stats.life,
            maxHealth: stats.life,
            energy: 100
        };

        console.log('Pet a ser criado:', petData);

        // Enviar o pedido de criação do pet
        window.electronAPI.createPet(petData);

        // Escutar a confirmação de criação e exibir a animação + revelar o pet
        window.electronAPI.onPetCreated((newPet) => {
            console.log('Pet criado com sucesso no renderer:', newPet);
            showFinalAnimation(newPet);
        });

        // Lidar com erro de criação
        window.electronAPI.on('create-pet-error', (event, error) => {
            console.error('Erro ao criar o pet:', error);
            alert('Erro ao criar o pet. Tente novamente.');
            document.getElementById('create-pet-button').disabled = false;
            document.getElementById('name-selection').style.display = 'block';
        });
    }, { once: true }); // Listener único
}

// Inicializar o quiz
selectedQuestions.push(...selectRandomQuestions());
showQuestion();