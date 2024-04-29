import { app, BrowserWindow, shell, ipcMain, session } from "electron";
import { release } from "node:os";
import { JSONFilePreset } from "lowdb/node";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { update } from "./update";
import { DefaultData } from "@/constants/initialData";
import { chat } from "./workflow/chat";
import { addDocuments, createKnowledgeBase } from "./knowledgeBase";
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

JSONFilePreset("default29.json", DefaultData)
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
    ipcMain.handle("get-knowledgeBases", async () => {
      await db.read();
      return db.data.knowledgeBases;
    });
    ipcMain.handle("get-integrations", async () => {
      await db.read();
      return db.data.integrations;
    });

    ipcMain.handle("add-knowledgeBase", async (event, post) => {
      await db.read();
      const newKnowledgeBase = createKnowledgeBase(db, post);
      await db.write();
      return newKnowledgeBase;
    });
    ipcMain.handle("add-documents", async (event, post) => {
      await db.read();
      const { files, id } = post;
      await addDocuments(files, id, db);
      await db.write();
      // return newKnowledgeBase;
    });
    ipcMain.handle("get-conversation", async (event, post) => {
      await db.read();
      return db.data.conversations[post.id];
    });
    ipcMain.handle("save-workflows", async (event, post) => {
      await db.read();
      const { workflowIdx, workflow } = post;
      await db.update(({ workflows }) => (workflows[workflowIdx] = workflow));
      await db.read();
      return db.data.workflows;
    });
    ipcMain.handle("save-integrations", async (event, post) => {
      await db.read();
      const { integrationIdx, integration } = post;
      await db.update(
        ({ integrations }) => (integrations[integrationIdx] = integration)
      );
      await db.read();
      return db.data.integrations;
    });
    ipcMain.handle("chat", async (event, post) => {
      await db.read();
      const { sessionId, workflowId, query, workflow } = post;
      const conversation = await chat(
        sessionId,
        workflowId,
        query,
        workflow,
        db
      );
      return conversation?.globalContext.messages;
      // await db.update(({ workflows }) => (workflows[workflowIdx] = workflow));
    });
  })
  .catch(console.log);
// const db = new Low(adapter);
async function createWindow() {
  await session.defaultSession.setProxy({
    proxyRules: "http://127.0.0.1:7890",
  });
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1000, // 设置窗口的默认宽度
    height: 700, // 设置窗口的默认高度
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
