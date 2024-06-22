import { OllamaEmbeddingModels, OpenAIEmbeddingModels } from '@/constants/models';
import { IConversation } from '@/type/conversation';
import { IIntegration } from '@/type/integration';
import { IWorkflow } from '@/type/workflow';
import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
	addWorkflow: (workflow: IWorkflow) => ipcRenderer.invoke('add-workflow', workflow),
	getWorkflows: () => ipcRenderer.invoke('get-workflows'),
	getTemplates: () => ipcRenderer.invoke('get-templates'),
	getIntegrations: () => ipcRenderer.invoke('get-integrations'),
	getSettings: () => ipcRenderer.invoke('get-settings'),
	getNodelets: () => ipcRenderer.invoke('get-nodelets'),
	getWorkSpace: () => ipcRenderer.invoke('get-workspace'),
	getKnowledgeBases: () => ipcRenderer.invoke('get-knowledgeBases'),
	getConversationById: (id: string) => ipcRenderer.invoke('get-conversation', { id }),
	getConversations: () => ipcRenderer.invoke('get-conversations'),
	getExtensions: () => ipcRenderer.invoke('get-extensions'),
	refreshExtensions: () => ipcRenderer.invoke('refresh-extensions'),
	saveWorkflows: (workflowIdx: number, workflow: IWorkflow) => ipcRenderer.invoke('save-workflows', { workflowIdx, workflow }),
	saveIntegration: (integrationIdx: number, integration: IIntegration) =>
		ipcRenderer.invoke('save-integrations', { integrationIdx, integration }),
	addKnowledgeBase: (name: string, description: string, model: OllamaEmbeddingModels | OpenAIEmbeddingModels, files: File[]) =>
		ipcRenderer.invoke('add-knowledgeBase', {
			files,
			name,
			description,
			model,
		}),
	addDocuments: (files: File[], id: string) => ipcRenderer.invoke('add-documents', { files, id }),
	saveSettings: (setting) => ipcRenderer.invoke('save-settings', { setting }),
	saveGlobal: (setting) => ipcRenderer.invoke('save-global', { setting }),
	chat: (sessionId: string, workflowId: string, query: string, workflow: IWorkflow) =>
		ipcRenderer.invoke('chat', { sessionId, workflowId, query, workflow }),
	runAutomation: (workflowId: string, inputs: any, workflow: IWorkflow) =>
		ipcRenderer.invoke('run-automation', { workflowId, inputs, workflow }),
	newConversation: (workflowId: string) => ipcRenderer.invoke('new-conversation', { workflowId }),
	saveConversation: (sessionId: string, conversation: IConversation) =>
		ipcRenderer.invoke('save-conversation', { sessionId, conversation }),
	openDialog: () => ipcRenderer.invoke('open-directory-dialog'),
	openNewWindow: () => ipcRenderer.send('open-modal'),
	on(...args: Parameters<typeof ipcRenderer.on>) {
		const [channel, listener] = args;
		return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
	},
	off(...args: Parameters<typeof ipcRenderer.off>) {
		const [channel, ...omit] = args;
		return ipcRenderer.off(channel, ...omit);
	},
	send(...args: Parameters<typeof ipcRenderer.send>) {
		const [channel, ...omit] = args;
		return ipcRenderer.send(channel, ...omit);
	},
	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
		const [channel, ...omit] = args;
		return ipcRenderer.invoke(channel, ...omit);
	},
});

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
	return new Promise((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve(true);
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true);
				}
			});
		}
	});
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find((e) => e === child)) {
			return parent.appendChild(child);
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find((e) => e === child)) {
			return parent.removeChild(child);
		}
	},
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`;
	const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
	const oStyle = document.createElement('style');
	const oDiv = document.createElement('div');

	oStyle.id = 'app-loading-style';
	oStyle.innerHTML = styleContent;
	oDiv.className = 'app-loading-wrap';
	oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle);
			safeDOM.append(document.body, oDiv);
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle);
			safeDOM.remove(document.body, oDiv);
		},
	};
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
	ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
