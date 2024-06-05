import { Edge, Node } from 'reactflow';

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
	description: string;
	category: IWorkflowCategory;
	lastModified: string;
	data: { nodes: Node[]; edges: Edge[] };
}
