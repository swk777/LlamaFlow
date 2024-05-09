import { IpcRenderer } from "electron";
import { IWorkflow } from "./workflow";
import { IIntegration } from "./integration";
import {
  OllamaEmbeddingModels,
  OpenAIEmbeddingModels,
} from "@/constants/models";

export interface IRendererApi extends IpcRenderer {
  addWorkflow: (workflow: IWorkflow) => void;
  getWorkflows: () => Promise<any>;
  getIntegrations: () => Promise<any>;
  getNodelets: () => Promise<any>;
  getKnowledgeBases: () => Promise<any>;
  getConversationById: (id: string) => Promise<any>;
  getConversations: () => Promise<any>;
  saveWorkflows: (workflowIdx: number, workflow: IWorkflow) => Promise<any>;
  saveIntegration: (
    integrationIdx: number,
    integration: IIntegration
  ) => Promise<any>;
  addKnowledgeBase: (
    name: string,
    description: string,
    model: OllamaEmbeddingModels | OpenAIEmbeddingModels,
    files: File[]
  ) => Promise<any>;
  addDocuments: (files: File[], id: string) => Promise<any>;
  chat: (
    sessionId: string,
    workflowId: string,
    query: string,
    workflow: IWorkflow
  ) => Promise<any>;
  newConversation: (workflowId: string) => Promise<any>;
  //   on: (channel: string, listener: (...args: any[]) => void) => void;
  //   off: (channel: string, listener: (...args: any[]) => void) => void;
  //   send: (channel: string, ...args: any[]) => void;
  //   invoke: (channel: string, ...args: any[]) => Promise<any>;
}
