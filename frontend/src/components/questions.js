const QUESTIONS = [
  {
    text: 'Um inimigo aparece subitamente no seu caminho. O que você faz?',
    options: {
      A: { text: 'Avanço sem hesitar, atacando com tudo.', attack: 1 },
      B: { text: 'Me protejo com um escudo e analiso.', defense: 1 },
      C: { text: 'Dou um salto rápido para o lado e recuo.', velocity: 1 },
    },
  },
  {
    text: 'Uma porta mágica tranca o seu caminho. Como você tenta abri-la?',
    options: {
      A: { text: 'Arrebento com força bruta.', attack: 1 },
      B: { text: 'Tento decifrar os símbolos e conjuro um feitiço.', magic: 1 },
      C: { text: 'Tento encontrar um mecanismo escondido ao redor.', defense: 1 },
    },
  },
  {
    text: 'Você encontra uma criatura ferida. O que faz?',
    options: {
      A: { text: 'A ajudo com magia de cura.', magic: 1 },
      B: { text: 'A ignoro e sigo em frente.', attack: 1 },
      C: { text: 'A protejo até que consiga se recuperar.', defense: 1 },
    },
  },
  {
    text: 'Um baú está preso entre armadilhas. Como age?',
    options: {
      A: { text: 'Uso magia para desativar o mecanismo.', magic: 1 },
      B: { text: 'Me movimento com rapidez para pegá-lo.', velocity: 1 },
      C: { text: 'Destruo o mecanismo com força.', attack: 1 },
    },
  },
  {
    text: 'Um aliado está em perigo. Você:',
    options: {
      A: { text: 'Salta na frente dele, recebendo o golpe.', defense: 1 },
      B: { text: 'Lança um feitiço para distração.', magic: 1 },
      C: { text: 'Derruba o inimigo antes que ataque.', attack: 1 },
    },
  },
  {
    text: 'Durante uma tempestade mágica, você:',
    options: {
      A: { text: 'Cria um campo de proteção.', magic: 1 },
      B: { text: 'Corre para se abrigar.', velocity: 1 },
      C: { text: 'Finca os pés no chão e resiste.', defense: 1 },
    },
  },
  {
    text: 'Para vencer um torneio, sua principal estratégia é:',
    options: {
      A: { text: 'Atacar com golpes poderosos.', attack: 1 },
      B: { text: 'Enganar o adversário com ilusões.', magic: 1 },
      C: { text: 'Resistir até que o oponente se canse.', defense: 1 },
    },
  },
  {
    text: 'Você encontra um livro antigo brilhando. O que faz?',
    options: {
      A: { text: 'Estudo seu conteúdo a fundo.', magic: 1 },
      B: { text: 'Levo comigo para o mestre analisar.', defense: 1 },
      C: { text: 'Testo um feitiço imediatamente.', attack: 1 },
    },
  },
  {
    text: 'Em uma emboscada, sua reação imediata é:',
    options: {
      A: { text: 'Contra-atacar com tudo.', attack: 1 },
      B: { text: 'Me esconder e observar.', defense: 1 },
      C: { text: 'Fugir rapidamente.', velocity: 1 },
    },
  },
  {
    text: 'Um espírito oferece um presente em troca de um enigma resolvido. Você:',
    options: {
      A: { text: 'Resolve com lógica mágica.', magic: 1 },
      B: { text: 'Tenta intimidá-lo e pegar à força.', attack: 1 },
      C: { text: 'Distrai o espírito e pega o item.', velocity: 1 },
    },
  },
  {
    text: 'Um monstro veloz está atacando. Sua tática:',
    options: {
      A: { text: 'Golpeá-lo antes que ele reaja.', attack: 1 },
      B: { text: 'Criar uma armadilha mágica.', magic: 1 },
      C: { text: 'Segurar firme e resistir.', defense: 1 },
    },
  },
  {
    text: 'Você encontra uma fonte de energia estranha. Como reage?',
    options: {
      A: { text: 'A absorvo imediatamente.', magic: 1 },
      B: { text: 'Testo um ataque nela.', attack: 1 },
      C: { text: 'Recuo e analiso de longe.', defense: 1 },
    },
  },
  {
    text: 'Seu grupo está cansado, mas há pressa. Você:',
    options: {
      A: { text: 'Força todos a continuar correndo.', velocity: 1 },
      B: { text: 'Protege o grupo e propõe descanso.', defense: 1 },
      C: { text: 'Usa magia para restaurar parte das energias.', magic: 1 },
    },
  },
  {
    text: 'Ao ver um inimigo forte, você:',
    options: {
      A: { text: 'Desafia de frente com coragem.', attack: 1 },
      B: { text: 'Se afasta e estuda os padrões de ataque.', defense: 1 },
      C: { text: 'Chama reforços e se prepara.', magic: 1 },
    },
  },
  {
    text: 'Você precisa atravessar uma ponte instável:',
    options: {
      A: { text: 'Corre rapidamente antes que desabe.', velocity: 1 },
      B: { text: 'Fortalece a estrutura com magia.', magic: 1 },
      C: { text: 'Atrai alguém para testar primeiro.', attack: 1 },
    },
  },
  {
    text: 'Seu pet está com medo. O que você faz?',
    options: {
      A: { text: 'Grito para ele reagir.', attack: 1 },
      B: { text: 'O acolho com um encantamento de calma.', magic: 1 },
      C: { text: 'Fico ao lado dele, firme.', defense: 1 },
    },
  },
  {
    text: 'Um desafio de reflexos é lançado. Você:',
    options: {
      A: { text: 'Se move mais rápido que o oponente.', velocity: 1 },
      B: { text: 'Usa feitiços para prever movimentos.', magic: 1 },
      C: { text: 'Se protege e observa antes de agir.', defense: 1 },
    },
  },
  {
    text: 'Um pergaminho antigo pede um guardião. Você:',
    options: {
      A: { text: 'Se oferece para guardá-lo.', defense: 1 },
      B: { text: 'O estuda para aprender seus segredos.', magic: 1 },
      C: { text: 'O vende por moedas.', attack: 1 },
    },
  },
  {
    text: 'Um oponente muito mais forte te desafia. Você:',
    options: {
      A: { text: 'Aceita a luta com bravura.', attack: 1 },
      B: { text: 'Usa um feitiço para equilibrar a luta.', magic: 1 },
      C: { text: 'Engana e escapa.', velocity: 1 },
    },
  },
  {
    text: 'Um labirinto mágico se abre. Qual seu plano?',
    options: {
      A: { text: 'Corro direto, confiante.', velocity: 1 },
      B: { text: 'Sinto a energia e sigo pelos caminhos menos óbvios.', magic: 1 },
      C: { text: 'Deixo marcas e avanço com cautela.', defense: 1 },
    },
  },
]

export default QUESTIONS
