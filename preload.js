const { contextBridge, ipcRenderer } = require('electron')
const Store = require('electron-store')

const store = new Store()

contextBridge.exposeInMainWorld('api', {
  close: () => ipcRenderer.send('window-close'),
  minimize: () => ipcRenderer.send('window-minimize'),
  toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
  quit: () => ipcRenderer.send('app-quit'),
  getPreference: (key) => store.get(key),
  setPreference: (key, value) => store.set(key, value),
})
