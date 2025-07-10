# Kadir11

Este projeto combina Electron e React para criar uma nova interface do jogo.

## Desenvolvimento

1. Certifique-se de ter Node.js instalado.
2. Para compilar o frontend React execute:

```bash
npm run build
```
O bundle sera gerado em `frontend/dist`.

3. Inicie a aplicação com:

```bash
npm start
```

Durante a execução pressione **Ctrl+Shift+D** para abrir o console de
desenvolvedor a qualquer momento.

Os assets utilizados pelo React ficam em `Assets/`.

## Compatibilidade

* **Electron**: a aplicação usa Electron na versão indicada em
  `package.json` (`^28.1.3`). Utilize uma versão compatível do Node.js
  (18 ou superior) para garantir o correto funcionamento.
* **React**: o frontend foi desenvolvido com React `^19.1.0`. Certifique-se
  de que a versão do Node instalada atende aos requisitos dessa versão do
  React.
* **JavaScript/Node.js**: recomenda-se utilizar Node.js 18 ou superior para
  compilar e executar o projeto sem problemas.

Ao iniciar o aplicativo, a tela principal exibe três botões: **Iniciar**,
**Opções** e **Sair**.
