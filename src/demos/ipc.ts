
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

try {
  const mapa = window.tmjAPI.loadMap('mapainicio')
  console.log(mapa)
} catch (error) {
  console.error('Erro ao carregar mapa:', error)
}
