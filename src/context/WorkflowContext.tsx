import useValidate from '@/hooks/useValidate';
import { IIntegration } from '@/type/integration';
import { INodelet } from '@/type/nodelet';
import { MouseEvent, ReactElement, createContext } from 'react';
import { Node } from 'reactflow';
interface IWorkflowContext {
	validatesResult: any;
	onNodeClick: (e: MouseEvent, node: Node) => void;
}
interface IProviderProps {
	children: ReactElement;
	validatesResult: any;
	onNodeClick: (e: MouseEvent, node: Node) => void;
	nodes: Node[];
	nodelets: INodelet[];
	integrations: IIntegration[];
}

export const WorkflowContext = createContext<IWorkflowContext>({
	validatesResult: [],
	onNodeClick: (e: MouseEvent, node: Node) => {},
});
export function WorkflowContextProvider(props: IProviderProps): ReactElement {
	const { children, nodes, nodelets, integrations, onNodeClick } = props;
	const validatesResult = useValidate(nodes, nodelets, integrations);

	return <WorkflowContext.Provider value={{ validatesResult, onNodeClick }}>{children}</WorkflowContext.Provider>;
}
