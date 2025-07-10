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

