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
	StringArray = 'StringArray',
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
export interface INodelet {
	id: string;
	category: NodeletCategory;
	workflowCategory: WorkflowCategory;
	description?: string;
	name: string;
	internal: boolean;
	integration?: boolean;
	image: string;
	inputs: NodeletInput[];
	outputs: NodeletOutput[];
	configDefinitions: IConfigBaseExtend<any>;
	codePath?: string;
}

export enum WorkflowCategory {
	'Chatbot' = 'Chatbot',
	'Automation' = 'Automation',
	'All' = 'All',
}
