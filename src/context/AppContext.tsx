import { IConversation } from '@/type/conversation';
import { IIntegration } from '@/type/integration';
import { IKnowledgeBase } from '@/type/knowledgeBase';
import { ISettings } from '@/type/misc';
import { ReactElement, createContext, useCallback, useEffect, useState } from 'react';
import { DefaultData } from '../constants/initialData';
import { Nodelet } from '../type/nodelet';
import { IWorkflow } from '../type/workflow';

interface IProviderProps {
	children: ReactElement;
}

interface IAppContext {
	settings: any;
	integrations: IIntegration[];
	workflows: IWorkflow[];
	nodelets: Nodelet[];
	knowledgeBases: IKnowledgeBase[];
	conversations: IConversation[];
	setConversations?: (newData: IConversation[]) => void;
	setWorkflows?: (newData: IWorkflow[]) => void;
	setNodelets?: (newData: Nodelet[]) => void;
	setKnowledgeBases?: (newData: IKnowledgeBase[]) => void;
	updateWorkflow?: (workflowId: string, newData: IWorkflow) => Promise<void>;
	updateIntegration?: (integrationId: string, newData: IIntegration) => Promise<void>;
	refreshKnowledgeBase: () => void;
	refreshConversations: () => void;
	refreshWorkflow: () => void;
	refreshSettings: () => void;
}
export const AppContext = createContext<IAppContext>({
	settings: DefaultData.settings,
	integrations: DefaultData.integrations,
	workflows: DefaultData.workflows,
	nodelets: DefaultData.nodelets,
	knowledgeBases: DefaultData.knowledgeBases,
	conversations: [],
	refreshKnowledgeBase: () => {},
	refreshConversations: () => {},
	refreshWorkflow: () => {},
	refreshSettings: () => {},
});

export function AppContextProvider(props: IProviderProps): ReactElement {
	const [workflows, setWorkflows] = useState(DefaultData.workflows as IWorkflow[]);
	const [knowledgeBases, setKnowledgeBases] = useState(DefaultData.knowledgeBases as IKnowledgeBase[]);
	const [integrations, setIntegrations] = useState(DefaultData.integrations as any[]);
	const [nodelets, setNodelets] = useState(DefaultData.nodelets as Nodelet[]);
	const [conversations, setConversations] = useState(DefaultData.conversations as IConversation[]);
	const [settings, setSettings] = useState(DefaultData.settings as ISettings);
	const { children } = props;
	const updateWorkflow = useCallback(
		async (workflowId: string, newData: IWorkflow) => {
			const workflowIdx = workflows.findIndex((wf) => wf.id === workflowId);
			if (workflowIdx === -1) {
				await window.ipcRenderer.addWorkflow(newData);
				await refreshWorkflow();
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
	const refreshWorkflow = async () => {
		setWorkflows(await window.ipcRenderer.getWorkflows());
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
	useEffect(() => {
		window.ipcRenderer.getNodelets().then(setNodelets);
		refreshWorkflow();
		refreshKnowledgeBase();
		refreshIntegrations();
		refreshConversations();
		refreshSettings();
	}, []);
	return (
		<AppContext.Provider
			value={{
				integrations,
				workflows,
				nodelets,
				knowledgeBases,
				conversations,
				settings,
				setConversations,
				setWorkflows,
				setNodelets,
				setKnowledgeBases,
				refreshWorkflow,
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
