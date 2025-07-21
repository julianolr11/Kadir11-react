import { app, BrowserWindow, shell, ipcMain } from 'electron'
import fs from 'node:fs'
import Store from 'electron-store'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.js')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Kadir11',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1536,
    height: 1024,
    resizable: false,
    maximizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Ensure the default menu bar is hidden
  win.setMenuBarVisibility(false)

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('quit-app', () => {
  app.quit()
})

const store = new Store()

ipcMain.handle('save-character', (_event, data) => {
  store.set('selectedCharacter', data)
})

ipcMain.handle('get-pet-assets', (_event, especie: string, elemento: string) => {
  const base = path.join(process.env.APP_ROOT, 'Assets', 'Mons')
  const sanitize = (name: string) =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
  const specieDir = path.join(base, sanitize(especie))

  const pickPetDir = (dir: string): string | undefined => {
    if (!fs.existsSync(dir)) return undefined
    const candidates = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
    if (!candidates.length) return undefined
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    const gif = path.join(dir, chosen, 'front.gif')
    if (fs.existsSync(gif)) return path.relative(process.env.APP_ROOT, gif).replace(/\\/g, '/')
    const png = path.join(dir, chosen, 'front.png')
    if (fs.existsSync(png)) return path.relative(process.env.APP_ROOT, png).replace(/\\/g, '/')
    return undefined
  }

  let assetPet = pickPetDir(path.join(specieDir, elemento))

  if (!assetPet) {
    const subdirs = fs
      .readdirSync(specieDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
    for (const sub of subdirs) {
      const candidate = pickPetDir(path.join(specieDir, sub))
      if (candidate) {
        assetPet = candidate
        break
      }
    }
  }

  const evoMp4 = path.join(base, 'evolution.mp4')
  const evoGif = path.join(base, 'evolution.gif')
  const animacaoEvolucao = fs.existsSync(evoMp4)
    ? path.relative(process.env.APP_ROOT, evoMp4).replace(/\\/g, '/')
    : fs.existsSync(evoGif)
      ? path.relative(process.env.APP_ROOT, evoGif).replace(/\\/g, '/')
      : ''

  return { animacaoEvolucao, assetPet }
})
