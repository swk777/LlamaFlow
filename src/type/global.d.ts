import { IRendererApi } from "./ipc";

type IValue = string | boolean;
type IFuncValueChange = (value: IValue, event: any) => void;

type IFuncNoop = () => void;
type IFuncVoid<T> = (p: T) => void;
type IFunc<T, K> = (p: T) => K;

interface IMDItem {
  value: string | number;
  label?: string;
  icon?: string;
}

interface Window {
  ipcRenderer: IRendererApi;
}
