import { NodeletExecuteContext } from '../type';

export async function executeTextInput({ globalContext, setNodeContext, nodeContext }: NodeletExecuteContext) {
	console.log(`executing node , current message: ${globalContext?.userInput}`);
	setNodeContext &&
		setNodeContext({
			outputs: { output: nodeContext?.text },
		});
}
