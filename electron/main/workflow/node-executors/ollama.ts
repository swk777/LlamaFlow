import { Ollama } from 'ollama';
import { NodeletExecuteContext } from '../type';
import { getContextPrompt } from '../utils';

export async function executeOllama({
	nodeInputs,
	globalContext,
	integrationConfig,
	nodeConfig,
	nodeContext,
	setNodeContext,
}: NodeletExecuteContext) {
	const { context = [], query = '' } = nodeInputs as { context: any[] | string; query: string | string[] };
	const { model, systemPrompt, temperature, contextCount, prompt } = nodeConfig;
	const { messages = [] } = nodeContext;
	const { variables } = globalContext;
	const ollama = new Ollama({ host: integrationConfig?.baseUrl || 'http://localhost:11434' });
	const combinedContext = Array.isArray(context) ? context.join('') : context;
	const replacedSystemPrompt = systemPrompt && systemPrompt.replace(/{(.*?)}/g, (match, key) => variables[key.trim()] || match);

	if (typeof query === 'string') {
		const queryVariables = { ...variables, query };
		const queryContent = prompt.replace(/{(.*?)}/g, (match, key) => queryVariables[key.trim()] || match);
		messages.push({
			role: 'user',
			content: context.length ? getContextPrompt(combinedContext, queryContent) : queryContent,
		});
		const completeMessages = messages.filter((message) => message.role !== 'system').slice(-(parseInt(contextCount) * 2 + 1));
		(replacedSystemPrompt || '').trim() && completeMessages.unshift({ role: 'system', content: replacedSystemPrompt });
		const response = await ollama.chat({
			model,
			messages: completeMessages,
			options: {
				temperature: parseFloat(temperature),
			},
		});
		completeMessages.push(response.message);
		setNodeContext &&
			setNodeContext({
				...nodeContext,
				messages: completeMessages,
				outputs: { answer: response.message.content },
			});
	} else if (Array.isArray(query) && query.length > 0) {
		const completions = query.map(async (item) => {
			const queryVariables = { ...variables, query: item };
			const queryContent = prompt.replace(/{(.*?)}/g, (match, key) => queryVariables[key.trim()] || match);
			const messages = [
				{
					role: 'user',
					content: context.length ? getContextPrompt(combinedContext, queryContent) : queryContent,
				},
			];
			if (replacedSystemPrompt) {
				messages.unshift({ role: 'system', content: replacedSystemPrompt });
			}
			return ollama.chat({
				model,
				messages: messages,
				options: {
					temperature: parseFloat(temperature),
				},
			});
		});
		const returnCompletions = [];
		for (let completion of completions) {
			returnCompletions.push(await completion);
		}
		const returnMessages = returnCompletions.map((response) => response.message.content).join('');
		setNodeContext &&
			setNodeContext({
				...nodeContext,
				messages: returnMessages,
				outputs: { answer: returnMessages },
			});
	}
}
