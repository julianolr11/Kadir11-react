const { BrowserWindow } = require('electron');
const path = require('path');

// Simple helper focused on managing a single main window. All
// game views are rendered through React inside this window.

class WindowManager {
  constructor() {
    this.mainWindow = null;
  }

  createMainWindow() {
    if (this.mainWindow) {
      this.mainWindow.focus();
      return this.mainWindow;
    }
    const preloadPath = path.join(__dirname, '..', 'preload.js');
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      transparent: true,
      resizable: false,
      show: false,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.mainWindow.loadFile('dist/index.html');
    this.mainWindow.once('ready-to-show', () => this.mainWindow.show());
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  getMainWindow() {
    return this.mainWindow;
  }

  closeMainWindow() {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }

  attachFadeHandlers(win) {
    if (!win) return;
    win.once('ready-to-show', () => win.show());
  }

  centerWindow(win) {
    if (win && typeof win.center === 'function') {
      win.center();
    }
  }

  // Placeholder methods referenced in main.js. They currently do nothing
  // but prevent errors if called before being fully implemented.
  closeCreatePetWindow() {}
  closeTrayWindow() {}
  closeStatusWindow() {}
}

module.exports = new WindowManager();
