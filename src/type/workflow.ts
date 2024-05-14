import { ReactFlowJsonObject } from 'reactflow';

export enum IWorkflowStatus {
	Draft = 'Draft',
	Published = 'Published',
}
export enum IWorkflowCategory {
	Chatbot = 'Chatbot',
	Automation = 'Automation',
}

export interface IWorkflow {
	id: string;
	name: string;
	category: IWorkflowStatus;
	lastModified: string;
	data: ReactFlowJsonObject;
}
