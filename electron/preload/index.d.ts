import { IRendererApi } from "./../../src/type/ipc";
interface Window {
  ipcRenderer: IRendererApi;
}
