# Kadir11

Kadir11 é um jogo estilo Tamagotchi escrito em [Electron](https://electronjs.org/).

## Instalação

1. Certifique‑se de ter o [Node.js](https://nodejs.org/) instalado.
2. Execute `npm install` para baixar as dependências.
3. Após a instalação das dependências, gere a pasta `dist` com:

```bash
npm run build
```

## Como iniciar

Após instalar as dependências e gerar a pasta `dist`, inicie o jogo com:

```bash
npm start
```

O comando `npm start` executa `electron .` abrindo a janela inicial (`start.html`).

## Resumo do funcionamento

- Na tela inicial é possível **criar** um novo pet ou **carregar** um existente.
- Os dados dos pets ficam salvos no diretório `pets/`.
- As imagens de cada pet ficam organizadas em pastas dentro de `Assets/Mons/`. Caso não exista uma pasta específica para um pet, a imagem `eggsy.png` é utilizada como padrão.
- O atalho `Ctrl+Shift+D` abre as ferramentas de desenvolvedor do Electron.

O projeto utiliza `electron-store` para persistência de algumas informações e
mantém diversas janelas HTML para as funções de criação, batalha e status do seu
pet.

## Principais comandos

- `npm install` – instalação das dependências.
- `npm run build` – compila o frontend React para a pasta `dist`.
- `npm start` – inicia a aplicação.


## Efeitos de Status

Alguns golpes podem aplicar condições especiais durante as batalhas. Os efeitos disponíveis são:

- **Queimadura**: dano de 2% a 3% da vida total por turno durante 2 a 3 turnos.
- **Envenenamento**: dano de 1% a 2% da vida total por turno durante 3 a 5 turnos.
- **Sangramento**: dano de 3% da vida atual por turno por 2 turnos.
- **Dormência**: impede o pet de agir por 1 a 3 turnos; receber dano desperta o pet.
- **Congelamento**: paralisa o pet por 1 a 3 turnos e só é removido por cura ou calor.
- **Paralisia**: 50% de chance de não agir por 1 a 2 turnos, reduzindo um pouco a velocidade.

Os ícones desses efeitos estão em `Assets/icons`.
