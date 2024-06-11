import { IConversation } from '@/type/conversation';
import { IIntegration } from '@/type/integration';
import { IKnowledgeBase } from '@/type/knowledgeBase';
import { ISettings } from '@/type/misc';
import { ITemplate } from '@/type/templates';
import { ReactElement, createContext, useCallback, useEffect, useState } from 'react';
import { DefaultData } from '../constants/initialData';
import { INodelet } from '../type/nodelet';
import { IWorkflow } from '../type/workflow';

interface IProviderProps {
	children: ReactElement;
}

interface IAppContext {
	settings: any;
	templates: ITemplate[];
	integrations: IIntegration[];
	workflows: IWorkflow[];
	extensions: any[];
	nodelets: INodelet[];
	knowledgeBases: IKnowledgeBase[];
	conversations: IConversation[];
	setExtensions?: (newData: any[]) => void;
	setConversations?: (newData: IConversation[]) => void;
	setWorkflows?: (newData: IWorkflow[]) => void;
	setNodelets?: (newData: INodelet[]) => void;
	setKnowledgeBases?: (newData: IKnowledgeBase[]) => void;
	updateWorkflow?: (workflowId: string, newData: IWorkflow) => Promise<void>;
	updateIntegration?: (integrationId: string, newData: IIntegration) => Promise<void>;
	refreshExtensions: () => void;
	refreshKnowledgeBase: () => void;
	refreshConversations: () => void;
	refreshWorkflows: () => void;
	refreshSettings: () => void;
}
export const AppContext = createContext<IAppContext>({
	//@ts-ignore
	templates: DefaultData.templates,
	settings: DefaultData.settings,
	integrations: DefaultData.integrations,
	workflows: DefaultData.workflows,
	nodelets: DefaultData.nodelets,
	knowledgeBases: DefaultData.knowledgeBases,
	conversations: [],
	extensions: [],
	refreshKnowledgeBase: () => {},
	refreshConversations: () => {},
	refreshWorkflows: () => {},
	refreshSettings: () => {},
	refreshExtensions: () => {},
});

export function AppContextProvider(props: IProviderProps): ReactElement {
	const [workflows, setWorkflows] = useState(DefaultData.workflows as IWorkflow[]);
	const [knowledgeBases, setKnowledgeBases] = useState(DefaultData.knowledgeBases as IKnowledgeBase[]);
	const [templates, setTemplates] = useState(DefaultData.templates as ITemplate[]);
	const [integrations, setIntegrations] = useState(DefaultData.integrations as any[]);
	const [nodelets, setNodelets] = useState(DefaultData.nodelets as INodelet[]);
	const [conversations, setConversations] = useState(DefaultData.conversations as IConversation[]);
	const [extensions, setExtensions] = useState([] as any[]);
	const [settings, setSettings] = useState(DefaultData.settings as ISettings);
	const { children } = props;
	const updateWorkflow = useCallback(
		async (workflowId: string, newData: IWorkflow) => {
			const workflowIdx = workflows.findIndex((wf) => wf.id === workflowId);
			if (workflowIdx === -1) {
				await window.ipcRenderer.addWorkflow(newData);
				await refreshWorkflows();
			} else {
				const workflows = await window.ipcRenderer.saveWorkflows(workflowIdx, newData);
				setWorkflows(workflows);
			}
		},
		[workflows],
	);
	const updateIntegration = useCallback(
		async (integrationId: string, newData: IIntegration) => {
			const IntegrationIdx = integrations.findIndex((wf) => wf.id === integrationId);
			const newIntegrations = await window.ipcRenderer.saveIntegration(IntegrationIdx, newData);
			setIntegrations(newIntegrations);
		},
		[workflows],
	);
	const refreshKnowledgeBase = useCallback(() => {
		window.ipcRenderer.getKnowledgeBases().then(setKnowledgeBases);
	}, []);
	const refreshTemplates = useCallback(() => {
		window.ipcRenderer.getTemplates().then(setTemplates);
	}, []);
	const refreshWorkflows = async () => {
		const allWorkflows = await window.ipcRenderer.getWorkflows();
		setWorkflows(allWorkflows);
	};
	const refreshIntegrations = async () => {
		setIntegrations(await window.ipcRenderer.getIntegrations());
	};
	const refreshConversations = async () => {
		setConversations(await window.ipcRenderer.getConversations());
	};
	const refreshSettings = async () => {
		setSettings(await window.ipcRenderer.getSettings());
	};
	const refreshExtensions = async () => {
		setExtensions(await window.ipcRenderer.getExtensions());
	};

	useEffect(() => {
		window.ipcRenderer.getNodelets().then(setNodelets);
		refreshExtensions();
		refreshWorkflows();
		refreshKnowledgeBase();
		refreshIntegrations();
		refreshConversations();
		refreshSettings();
		refreshTemplates();
	}, []);
	return (
		<AppContext.Provider
			value={{
				templates,
				integrations,
				workflows,
				nodelets,
				knowledgeBases,
				conversations,
				settings,
				extensions,
				setExtensions,
				setConversations,
				setWorkflows,
				setNodelets,
				setKnowledgeBases,
				refreshWorkflows,
				refreshExtensions,
				refreshConversations,
				updateWorkflow,
				updateIntegration,
				refreshSettings,
				refreshKnowledgeBase,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
