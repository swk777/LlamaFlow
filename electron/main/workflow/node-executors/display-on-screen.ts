import { NodeletExecuteContext } from '../type';

export async function executeDisplayOnScreen({ nodelet, nodeInputs, globalContext, setGlobalContext, node }: NodeletExecuteContext) {
	const { displayContent } = nodeInputs as { displayContent: string };
	setGlobalContext &&
		setGlobalContext({
			...globalContext,
			outputMessage: { ...globalContext.outputMessage, [node.id]: { name: node.data.label ?? nodelet.name, content: displayContent } },
		});
}
