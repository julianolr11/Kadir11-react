const { BrowserWindow, screen } = require('electron');
const path = require('path');

class WindowManager {
    constructor() {
        this.startWindow = null;
        this.createPetWindow = null;
        this.loadPetWindow = null;
        this.trayWindow = null;
        this.statusWindow = null;
    }

    // Criar a janela inicial (start.html)
    createStartWindow() {
        if (this.startWindow) {
            this.startWindow.focus();
            return this.startWindow;
        }

        const preloadPath = path.join(__dirname, '..', 'preload.js');
        this.startWindow = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            transparent: true,
            resizable: false,
            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.startWindow.loadFile('start.html');
        this.startWindow.on('closed', () => {
            this.startWindow = null;
        });

        return this.startWindow;
    }

    // Pegar a startWindow
    getStartWindow() {
        return this.startWindow;
    }

    // Fechar a startWindow
    closeStartWindow() {
        if (this.startWindow) {
            this.startWindow.close();
            this.startWindow = null;
        }
    }

    // Criar a janela de criação de pet (create-pet.html)
    createCreatePetWindow() {
        if (this.createPetWindow) {
            this.createPetWindow.focus();
            return this.createPetWindow;
        }

        const preloadPath = path.join(__dirname, '..', 'preload.js');
        this.createPetWindow = new BrowserWindow({
            width: 600,
            height: 400,
            frame: false,
            transparent: true,
            resizable: false,
            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.createPetWindow.loadFile('create-pet.html');
        this.createPetWindow.on('closed', () => {
            this.createPetWindow = null;
        });

        return this.createPetWindow;
    }

    // Fechar a createPetWindow
    closeCreatePetWindow() {
        if (this.createPetWindow) {
            this.createPetWindow.close();
            this.createPetWindow = null;
        }
    }

    // Criar a janela de carregar pet (load-pet.html)
    createLoadPetWindow() {
        if (this.loadPetWindow) {
            this.loadPetWindow.focus();
            return this.loadPetWindow;
        }

        const preloadPath = path.join(__dirname, '..', 'preload.js');
        this.loadPetWindow = new BrowserWindow({
            width: 600,
            height: 400,
            frame: false,
            transparent: true,
            resizable: false,
            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.loadPetWindow.loadFile('load-pet.html');
        this.loadPetWindow.on('closed', () => {
            this.loadPetWindow = null;
        });

        return this.loadPetWindow;
    }

    // Fechar a loadPetWindow
    closeLoadPetWindow() {
        if (this.loadPetWindow) {
            this.loadPetWindow.close();
            this.loadPetWindow = null;
        }
    }

    // Criar a bandeja (index.html)
    createTrayWindow() {
        if (this.trayWindow) {
            this.trayWindow.focus();
            return this.trayWindow;
        }

        const preloadPath = path.join(__dirname, '..', 'preload.js');

        // Pegar as dimensões da tela principal
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

        // Definir o tamanho da janela
        const windowWidth = 256;
        const windowHeight = 256;

        // Calcular a posição no canto inferior direito (com uma margem de 10px)
        const margin = 10;
        const x = screenWidth - windowWidth - margin;
        const y = screenHeight - windowHeight - margin;

        this.trayWindow = new BrowserWindow({
            width: windowWidth,
            height: windowHeight,
            x: x, // Posição X (canto direito)
            y: y, // Posição Y (canto inferior)
            frame: false,
            transparent: true,
            resizable: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.trayWindow.loadFile('index.html');
        this.trayWindow.on('closed', () => {
            this.trayWindow = null;
        });

        return this.trayWindow;
    }

    // Criar a janela de status (status.html)
    createStatusWindow() {
        if (this.statusWindow) {
            this.statusWindow.focus();
            return this.statusWindow;
        }

        const preloadPath = path.join(__dirname, '..', 'preload.js');
        this.statusWindow = new BrowserWindow({
            width: 400,
            height: 500,
            frame: false,
            transparent: true,
            resizable: false,
            webPreferences: {
                preload: preloadPath,
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        this.statusWindow.loadFile('status.html');
        this.statusWindow.on('closed', () => {
            this.statusWindow = null;
        });

        return this.statusWindow;
    }
}

module.exports = new WindowManager();