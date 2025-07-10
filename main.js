const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

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
      preload: path.join(__dirname, 'preload.js')
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
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
