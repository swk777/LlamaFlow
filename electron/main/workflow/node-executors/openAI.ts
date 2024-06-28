import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import ExecutionError from '../../error/ExecutionError';
import { NodeletExecuteContext } from '../type';
import { getContextPrompt } from '../utils';

export async function executeOpenAI({
	nodeContext = {},
	nodeConfig,
	node,
	integrationConfig,
	nodeInputs,
	globalContext,
	setNodeContext,
}: NodeletExecuteContext) {
	const { context = [], query = '' } = nodeInputs as { context: any[]; query: string | string[] };
	const { model, systemPrompt, temperature, contextCount, prompt } = nodeConfig;
	const { messages = [] } = nodeContext;
	const combinedContext = Array.isArray(context) ? context.join('') : context;
	const openaiParams: { apiKey: string; organization?: string; baseURL?: string } = {
		apiKey: integrationConfig.apiKey,
	};
	if (!openaiParams.apiKey) {
		throw new ExecutionError(node.id, 'OpenAI API key is required');
	}
	if (integrationConfig.organization) {
		openaiParams.organization = integrationConfig.organization;
	}
	const { variables } = globalContext;
	const replacedSystemPrompt = systemPrompt && systemPrompt.replace(/{(.*?)}/g, (match, key) => variables[key.trim()] || match);
	const openai = new OpenAI(openaiParams);

	if (typeof query === 'string') {
		const queryVariables = { ...variables, query };
		const queryContent = prompt.replace(/{(.*?)}/g, (match, key) => queryVariables[key.trim()] || match);
		messages.push({
			role: 'user',
			content: context.length ? getContextPrompt(combinedContext, queryContent) : queryContent,
		});
		const completeMessages = messages.filter((message) => message.role !== 'system').slice(-(parseInt(contextCount) * 2 + 1));
		(replacedSystemPrompt || '').trim() && completeMessages.unshift({ role: 'system', content: replacedSystemPrompt });
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
	} else if (Array.isArray(query) && query.length > 0) {
		const returnCompletions = await Promise.all(
			query.map(async (item) => {
				const queryVariables = { ...variables, query: item };
				const queryContent = prompt.replace(/{(.*?)}/g, (match, key) => queryVariables[key.trim()] || match);
				const completeMessages: ChatCompletionMessageParam[] = [
					{
						role: 'user',
						content: context.length ? getContextPrompt(combinedContext, queryContent) : queryContent,
					},
				];
				if (replacedSystemPrompt) {
					completeMessages.unshift({ role: 'system', content: replacedSystemPrompt });
				}
				return openai.chat.completions.create({
					messages: completeMessages,
					model,
					temperature: parseFloat(temperature),
				});
			}),
		);
		const returnMessages = returnCompletions.map((complete) => complete.choices[0].message?.content).join('');

		setNodeContext &&
			setNodeContext({
				...nodeContext,
				outputs: { answer: returnMessages || '' },
			});
	}
}
