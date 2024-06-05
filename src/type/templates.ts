import { Edge } from 'reactflow';
import { IWorkflowCategory } from './workflow';

export interface ITemplate {
	id: string;
	name: string;
	category: IWorkflowCategory;
	description: string;
	data: { nodes: Node[]; edges: Edge[] };
}
