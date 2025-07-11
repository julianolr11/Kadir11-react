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
4. Para desenvolver o aplicativo desktop simultaneamente:
   ```bash
   npm run dev
   ```
5. Para gerar a versão de produção:
   ```bash
   npm run build
   ```

## Rodar como aplicativo desktop

1. Para testar em modo desenvolvimento, execute:
   ```bash
   npm run dev
   ```
   Isso abre o app em uma janela do Electron usando o servidor do Vite.
2. Para gerar a versão de produção, rode `npm run build` e então:
   ```bash
   npm run electron
   ```

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

