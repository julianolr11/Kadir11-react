# Kadir11

Boilerplate usando **React**, **Vite** e **Tailwind CSS**.

## Desenvolvimento

1. Certifique-se de ter o Node.js instalado.
2. Instale as dependências do projeto executando:
   ```bash
   npm install
   npm install --prefix frontend
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. Para gerar a versão de produção:
   ```bash
   npm run build
   ```

## Rodar como aplicativo desktop

1. Gere a build de produção com `npm run build`.
2. Em seguida, execute:
   ```bash
   npm run electron
   ```
Isso abre o app em uma janela do Electron.

Os assets utilizados pelo React ficam em `Assets/`.

As preferências do usuário (volume, idioma e modo de tela cheia) são
armazenadas com [electron-store](https://github.com/sindresorhus/electron-store)
quando o jogo roda como aplicativo desktop.

### Nota sobre tela cheia

Alguns navegadores bloqueiam a entrada automática em modo tela cheia caso não
haja interação do usuário. Se você habilitar a opção "Tela cheia" nas
configurações e o jogo não abrir expandido, ative o modo manualmente pelo
menu de opções.

## Licença

Este projeto está licenciado sob os termos da [MIT License](LICENSE).

