import { Nodelet } from '@/type/nodelet';

export interface InputsObject {
	[key: string]: any;
}

export interface NodeletExecuteContextFull {
	nodelet: Nodelet;
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
