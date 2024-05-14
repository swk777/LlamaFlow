import { Node } from 'reactflow';

export interface IDAGNode extends Node {
	nextNodes: IDAGNode[];
	sourceNodes: IDAGNode[];
	sourceHandle?: string | null;
	targetHandle?: string | null;
}
