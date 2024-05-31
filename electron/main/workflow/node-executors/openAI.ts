import OpenAI from 'openai';
import { NodeletExecuteContext } from '../type';
import { getContextPrompt } from '../utils';

export async function executeOpenAI({
	nodeContext = {},
	nodeConfig,
	integrationConfig,
	nodeInputs,
	setNodeContext,
}: NodeletExecuteContext) {
	const { context = [], query = '' } = nodeInputs as { context: any[]; query: string };
	const { model, systemPrompt, temperature, contextCount } = nodeConfig;
	const { messages = [] } = nodeContext;
	messages.push({
		role: 'user',
		content: context.length ? getContextPrompt(context.join(''), query) : query,
	});
	const openai = new OpenAI({
		apiKey: integrationConfig.apiKey, // This is the default and can be omitted
		//organization: integrationConfig.organization
	});
	const completeMessages = messages.filter((message) => message.role !== 'system').slice(-(parseInt(contextCount) * 2 + 1));
	(systemPrompt || '').trim() && completeMessages.unshift({ role: 'system', content: systemPrompt });

	const chatCompletion = await openai.chat.completions.create({
		messages: completeMessages,
		model,
		temperature: parseFloat(temperature),
	});
	const returnMessage = chatCompletion.choices[0].message;
	completeMessages.push(returnMessage);
	setNodeContext &&
		setNodeContext({
			...nodeContext,
			messages: completeMessages,
			outputs: { answer: returnMessage?.content || '' },
		});
}
