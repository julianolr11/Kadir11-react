import { app, ipcMain, BrowserWindow, shell } from "electron";
import fs from "node:fs";
import Store from "electron-store";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
const { autoUpdater } = createRequire(import.meta.url)("electron-updater");
function update(win2) {
  autoUpdater.autoDownload = false;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.on("checking-for-update", function() {
  });
  autoUpdater.on("update-available", (arg) => {
    win2.webContents.send("update-can-available", { update: true, version: app.getVersion(), newVersion: arg?.version });
  });
  autoUpdater.on("update-not-available", (arg) => {
    win2.webContents.send("update-can-available", { update: false, version: app.getVersion(), newVersion: arg?.version });
  });
  ipcMain.handle("check-update", async () => {
    if (!app.isPackaged) {
      const error = new Error("The update feature is only available after the package.");
      return { message: error.message, error };
    }
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      return { message: "Network error", error };
    }
  });
  ipcMain.handle("start-download", (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          event.sender.send("update-error", { message: error.message, error });
        } else {
          event.sender.send("download-progress", progressInfo);
        }
      },
      () => {
        event.sender.send("update-downloaded");
      }
    );
  });
  ipcMain.handle("quit-and-install", () => {
    autoUpdater.quitAndInstall(false, true);
  });
}
function startDownload(callback, complete) {
  autoUpdater.on("download-progress", (info) => callback(null, info));
  autoUpdater.on("error", (error) => callback(error, null));
  autoUpdater.on("update-downloaded", complete);
  autoUpdater.downloadUpdate();
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "../..");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(process.env.APP_ROOT, "preload.js");
const indexHtml = path.join(RENDERER_DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Kadir11",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1536,
    height: 1024,
    resizable: false,
    maximizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenuBarVisibility(false);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  update(win);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.handle("quit-app", () => {
  app.quit();
});
const store = new Store();
ipcMain.handle("save-character", (_event, data) => {
  store.set("selectedCharacter", data);
});
ipcMain.handle("get-pet-assets", (_event, especie, elemento) => {
  const base = path.join(process.env.APP_ROOT, "Assets", "Mons");
  const sanitize = (name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
  const specieDir = path.join(base, sanitize(especie));
  const pickPetDir = (dir) => {
    if (!fs.existsSync(dir)) return void 0;
    const candidates = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    if (!candidates.length) return void 0;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const gif = path.join(dir, chosen, "front.gif");
    if (fs.existsSync(gif)) return path.relative(process.env.APP_ROOT, gif).replace(/\\/g, "/");
    const png = path.join(dir, chosen, "front.png");
    if (fs.existsSync(png)) return path.relative(process.env.APP_ROOT, png).replace(/\\/g, "/");
    return void 0;
  };
  let assetPet = pickPetDir(path.join(specieDir, elemento));
  if (!assetPet) {
    const subdirs = fs.readdirSync(specieDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    for (const sub of subdirs) {
      const candidate = pickPetDir(path.join(specieDir, sub));
      if (candidate) {
        assetPet = candidate;
        break;
      }
    }
  }
  const evoMp4 = path.join(base, "evolution.mp4");
  const evoGif = path.join(base, "evolution.gif");
  const animacaoEvolucao = fs.existsSync(evoMp4) ? path.relative(process.env.APP_ROOT, evoMp4).replace(/\\/g, "/") : fs.existsSync(evoGif) ? path.relative(process.env.APP_ROOT, evoGif).replace(/\\/g, "/") : "";
  return { animacaoEvolucao, assetPet };
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=index.js.map
