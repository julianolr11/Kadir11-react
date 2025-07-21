// Entry point for the Electron application
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const distIndex = path.join(__dirname, 'frontend', 'dist', 'index.html');
const isDev = !fs.existsSync(distIndex);

// Resolve the preload script using an absolute path so it works in
// both development and packaged builds
const preloadPath = path.join(app.getAppPath(), 'preload.js');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#000000',
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: preloadPath
    }
  });

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (win) {
      win.webContents.openDevTools();
    }
  });

  ipcMain.on('window-close', () => {
    win.close();
  });

  ipcMain.on('window-minimize', () => {
    win.minimize();
  });

  ipcMain.on('window-toggle-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('app-quit', () => {
    app.quit();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
