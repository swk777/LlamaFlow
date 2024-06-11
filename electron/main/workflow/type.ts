import { INodelet } from '@/type/nodelet';
import { Node } from 'reactflow';

export interface InputsObject {
	[key: string]: any;
}

export interface NodeletExecuteContextFull {
	node: Node;
	nodelet: INodelet;
	nodeContext: any;
	globalContext: any;
	nodeConfig: any;
	integrationConfig: any;
	nodeInputs: InputsObject;
	context: any;
	setNodeContext: (nodeContext: any) => void;
	setGlobalContext: (globalContext: any) => void;
}

export type NodeletExecuteContext = Partial<NodeletExecuteContextFull>;
