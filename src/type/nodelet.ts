import { IConfigBaseExtend } from './configDefinition';

export enum NodeletCategory {
	Input = 'Input',
	Processor = 'Processor',
	Output = 'Output',
}
export enum NodeletInputType {
	String = 'String',
	Context = 'Context',
}
export enum NodeletOutputType {
	String = 'String',
	Context = 'Context',
}
export interface NodeletInput {
	id: string;
	name: string;
	type: NodeletInputType;
}
export interface NodeletOutput {
	id: string;
	name: string;
	type: NodeletOutputType;
}
export interface Nodelet {
	id: string;
	category: NodeletCategory;
	workflowCategory: WorkflowCategory;
	name: string;
	internal: boolean;
	integration?: boolean;
	image: string;
	inputs: NodeletInput[];
	outputs: NodeletOutput[];
	configDefinitions: IConfigBaseExtend<any>;
}

export enum WorkflowCategory {
	'Chatbot' = 'Chatbot',
	'Automation' = 'Automation',
	'All' = 'All',
}
