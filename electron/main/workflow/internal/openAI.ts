import { HttpsProxyAgent } from 'https-proxy-agent';
import OpenAI from 'openai';
import { getContextPrompt } from '../utils';

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

export async function executeOpenAI({ nodeId, nodeContext = {}, nodeConfig, integrationConfig, nodeInputs, setNodeContext }) {
	const { context = [], query = '' } = nodeInputs;
	const { model, systemPrompt, temperature, contextCount } = nodeConfig;
	const { messages = [] } = nodeContext;
	messages.push({
		role: 'user',
		content: context.length ? getContextPrompt(context.join(''), query) : query,
	});
	const openai = new OpenAI({
		apiKey: integrationConfig.apiKey, // This is the default and can be omitted
		httpAgent: httpsAgent,
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
	setNodeContext(nodeId, {
		...nodeContext,
		messages: completeMessages,
		outputs: { answer: returnMessage?.content || '' },
	});
}
