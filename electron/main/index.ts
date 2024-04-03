import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { JSONFilePreset } from "lowdb/node";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { update } from "./update";

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const defaultData = {
  workflows: [
    {
      id: "1",
      name: "hello world",
      category: "draft",
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "2",
      name: "hello world",
      category: "draft",
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "3",
      name: "hello world",
      category: "draft",
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "4",
      name: "hello world",
      category: "draft",
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "5",
      name: "hello world",
      category: "draft",
      lastModified: "2023-07-12 10:42 AM",
    },
  ],
  nodelets: [
    {
      id: "input1",
      category: "input",
      name: "Input1",
      isPlugin: false,
      image:
        "data:image/png;base64,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",
      config: {
        definition: [{ fieldName: "string", label: "string", type: "STRING" }],
      },
    },
    {
      id: "input2",
      category: "input",
      name: "Input2",
      isPlugin: false,
      image:
        "data:image/png;base64,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",
      config: {
        definition: [{ fieldName: "string", label: "string", type: "STRING" }],
      },
    },
    {
      id: "input3",
      category: "input",
      name: "Input3",
      isPlugin: false,
      image:
        "data:image/png;base64,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",
      config: {
        definition: [{ fieldName: "string", label: "string", type: "STRING" }],
      },
    },
  ],
};
JSONFilePreset("test1.json", defaultData)
  .then((db) => {
    ipcMain.on("add-workflow", async (event, post) => {
      await db.read();
      db.data.workflows.push(post);
      await db.write();
    });
    ipcMain.handle("get-nodelets", async () => {
      await db.read();
      return db.data.nodelets;
    });

    ipcMain.handle("get-workflows", async () => {
      await db.read();
      return db.data.workflows;
    });
  })
  .catch(console.log);
// const db = new Low(adapter);
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
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

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
