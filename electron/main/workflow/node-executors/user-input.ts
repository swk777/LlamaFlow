import { NodeletExecuteContext } from '../type';

export async function executeUserInput({ globalContext, setNodeContext }: NodeletExecuteContext) {
	console.log(`executing node current message: ${globalContext?.userInput}`);
	setNodeContext &&
		setNodeContext({
			outputs: { query: globalContext?.userInput },
		});
}
