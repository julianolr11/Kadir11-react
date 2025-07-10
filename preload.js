const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  versions: process.versions,
  quit: () => ipcRenderer.send('quit-app')
})
