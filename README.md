# Kadir11

Kadir11 é um jogo estilo Tamagotchi escrito em [Electron](https://electronjs.org/).

## Instalação

1. Certifique‑se de ter o [Node.js](https://nodejs.org/) instalado.
2. Execute `npm install` para baixar as dependências.

```bash
npm install
```

## Como iniciar

Após instalar as dependências, inicie o jogo com:

```bash
npm start
```

O comando `npm start` executa `electron .` abrindo a janela inicial (`start.html`).

## Resumo do funcionamento

- Na tela inicial é possível **criar** um novo pet ou **carregar** um existente.
- Os dados dos pets ficam salvos no diretório `pets/`.
- O atalho `Ctrl+Shift+D` abre as ferramentas de desenvolvedor do Electron.

O projeto utiliza `electron-store` para persistência de algumas informações e
mantém diversas janelas HTML para as funções de criação, batalha e status do seu
pet.

## Principais comandos

- `npm install` – instalação das dependências.
- `npm start` – inicia a aplicação.

