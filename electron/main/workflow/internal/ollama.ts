import { Ollama } from 'ollama';
import { getContextPrompt } from '../utils';

export async function executeOllama({ nodeId, nodeInputs, integrationConfig, nodeConfig, nodeContext, setNodeContext }) {
	const { context = [], query = '' } = nodeInputs;
	const { model, systemPrompt, temperature, contextCount } = nodeConfig;
	const { messages = [] } = nodeContext;
	console.log(integrationConfig?.baseUrl);
	const ollama = new Ollama({ host: integrationConfig?.baseUrl || 'http://localhost:11434' });
	messages.push({
		role: 'user',
		content: context.length ? getContextPrompt(context.join(''), query) : query,
	});
	const completeMessages = messages.filter((message) => message.role !== 'system').slice(-(parseInt(contextCount) * 2 + 1));
	(systemPrompt || '').trim() && completeMessages.unshift({ role: 'system', content: systemPrompt });
	console.log(model);
	console.log(completeMessages);
	const response = await ollama.chat({
		model,
		messages: completeMessages,
		options: {
			temperature: parseFloat(temperature),
		},
	});
	completeMessages.push(response.message);
	setNodeContext(nodeId, {
		...nodeContext,
		messages: completeMessages,
		outputs: { answer: response.message.content },
	});
}
