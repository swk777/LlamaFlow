import { Ollama } from 'ollama';
import { NodeletExecuteContext } from '../type';
import { getContextPrompt } from '../utils';

export async function executeOllama({ nodeInputs, integrationConfig, nodeConfig, nodeContext, setNodeContext }: NodeletExecuteContext) {
	const { context = [], query = '' } = nodeInputs as { context: any[]; query: string };
	const { model, systemPrompt, temperature, contextCount } = nodeConfig;
	const { messages = [] } = nodeContext;
	const ollama = new Ollama({ host: integrationConfig?.baseUrl || 'http://localhost:11434' });
	messages.push({
		role: 'user',
		content: context.length ? getContextPrompt(context.join(''), query) : query,
	});
	const completeMessages = messages.filter((message) => message.role !== 'system').slice(-(parseInt(contextCount) * 2 + 1));
	(systemPrompt || '').trim() && completeMessages.unshift({ role: 'system', content: systemPrompt });
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
}
