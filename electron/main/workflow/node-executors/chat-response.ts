import { NodeletExecuteContext } from '../type';

export async function executeChatResponse({ nodeInputs, globalContext, setGlobalContext }: NodeletExecuteContext) {
	const { output } = nodeInputs as { output: string };
	setGlobalContext &&
		setGlobalContext({
			...globalContext,
			outputMessage: output,
		});
}
