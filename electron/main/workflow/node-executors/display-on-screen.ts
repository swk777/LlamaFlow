import { NodeletExecuteContext } from '../type';

export async function executeDisplayOnScreen({ nodelet, nodeInputs, globalContext, setGlobalContext, node }: NodeletExecuteContext) {
	console.log(nodeInputs);
	const { displayContent } = nodeInputs as { displayContent: string };
	console.log('displayContent:' + displayContent);
	setGlobalContext &&
		setGlobalContext({
			...globalContext,
			outputMessage: { ...globalContext.outputMessage, [node.id]: { name: nodelet.name, content: displayContent } },
		});
}
