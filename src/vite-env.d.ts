/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
  setCursorType?: (type: 'default' | 'pointer' | 'grab' | 'leave') => void
  getPetAssets: (especie: string, elemento: string) => Promise<{ animacaoEvolucao: string, assetPet: string | undefined }>
}
