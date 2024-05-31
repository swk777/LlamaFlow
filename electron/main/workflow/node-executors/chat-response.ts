import { NodeletExecuteContext } from '../type';

export async function executeChatResponse({ nodeInputs, globalContext, setGlobalContext }: NodeletExecuteContext) {
	const { output } = nodeInputs as { output: string };
	console.log(output);
	setGlobalContext &&
		setGlobalContext({
			...globalContext,
			outputMessage: output,
		});
}
