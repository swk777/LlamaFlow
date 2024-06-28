import { ConfigurationType } from '@/node/config/configType';
import { INodelet, NodeletCategory, NodeletInputType, NodeletOutputType, WorkflowCategory } from '@/type/nodelet';

export enum InternalNodelets {
	UserInput = 'UserInput',
	TextInput = 'TextInput',
	TextAreaInput = 'TextAreaInput',
	KnowledgeBase = 'KnowledgeBase',
	OpenAI = 'OpenAI',
	Ollama = 'Ollama',
	ChatResponse = 'ChatResponse',
	SaveToFile = 'SaveToFile',
	DisplayOnScreen = 'DisplayOnScreen',
	FireCrawl = 'FireCrawl',
	URLLoader = 'URLLoader',
	YoutubeLoader = 'YoutubeLoader',
	Email = 'Email',
	DeepSeek = 'DeepSeek',
	SplitText = 'SplitText',
}

export const Nodelets: INodelet[] = [
	{
		id: 'UserInput',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.Chatbot,
		name: 'User Input',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'query',
				name: 'query',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [],
	},
	{
		id: 'TextInput',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.Automation,
		name: 'Text Input',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'output',
				name: 'output',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'text',
				fieldName: 'text',
				label: 'text',
				type: 'INPUT',
				placeholder: 'Enter text',
				isDisplayed: true,
			},
		],
	},
	{
		id: 'TextAreaInput',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.Automation,
		name: 'TextArea Input',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'output',
				name: 'output',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'text',
				fieldName: 'text',
				label: 'text',
				type: 'TEXT_AREA',
				placeholder: 'Enter text',
				isDisplayed: true,
			},
		],
	},
	{
		id: 'KnowledgeBase',
		category: NodeletCategory.Processor,
		workflowCategory: WorkflowCategory.All,
		name: 'Knowledge Base',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'query',
				name: 'query',
				type: NodeletInputType.String,
			},
		],
		outputs: [
			{
				id: 'RelativeContent',
				name: 'relative content',
				type: NodeletOutputType.Context,
			},
		],
		configDefinitions: [
			{
				name: 'Knowledge Base',
				fieldName: 'knowledgeBase',
				label: 'string',
				required: true,
				isDisplayed: true,
				displayPath: 'name',
				type: ConfigurationType.KNOWLEDGE_BASE,
				placeholder: 'choose knowledge base',
			},
		],
	},
	{
		id: 'OpenAI',
		category: NodeletCategory.Processor,
		workflowCategory: WorkflowCategory.All,
		name: 'OpenAI',
		internal: true,
		integration: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'query',
				name: 'query',
				type: NodeletInputType.String,
			},
			{
				id: 'context',
				name: 'context',
				type: NodeletInputType.Context,
			},
		],
		outputs: [
			{
				id: 'answer',
				name: 'answer',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'systemPrompt',
				fieldName: 'systemPrompt',
				label: 'System Prompt',
				type: 'TEXT_AREA',
				placeholder: 'System Prompt',
			},
			{
				name: 'prompt',
				fieldName: 'prompt',
				label: 'Prompt',
				type: 'TEXT_AREA',
				placeholder: 'Prompt',
				defaultValue: '{query}',
				description: 'use {xxx} to quote variables and use {query} to quote the input',
			},
			{
				name: 'model',
				fieldName: 'model',
				label: 'Model:',
				type: 'SELECT',
				placeholder: 'openai model',
				isDisplayed: true,
				defaultValue: 'gpt-3.5-turbo',
				misc: {
					values: [
						{ value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
						{ value: 'gpt-3.5-turbo-16k', label: 'gpt-3.5-turbo-16k' },
						{ value: 'gpt-4', label: 'gpt-4' },
						{ value: 'gpt-4o', label: 'gpt-4o' },
						{ value: 'gpt-4-32k', label: 'gpt-4-32k' },
						{ value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
						{ value: 'gpt-4-turbo-preview', label: 'gpt-4-turbo-preview' },
					],
				},
			},
			{
				name: 'temperature',
				fieldName: 'temperature',
				label: 'Temperature:',
				type: 'SELECT',
				placeholder: 'Temperature',
				defaultValue: '0.7',
				misc: {
					values: [
						{ value: '0.1', label: '0.1' },
						{ value: '0.2', label: '0.2' },
						{ value: '0.3', label: '0.3' },
						{ value: '0.4', label: '0.4' },
						{ value: '0.5', label: '0.5' },
						{ value: '0.6', label: '0.6' },
						{ value: '0.7', label: '0.7' },
						{ value: '0.8', label: '0.8' },
						{ value: '0.9', label: '0.9' },
						{ value: '1', label: '1' },
					],
				},
			},
			{
				name: 'contextCount',
				fieldName: 'contextCount',
				label: 'Context Count:',
				type: 'SELECT',
				placeholder: 'Context Count',
				defaultValue: '1',
				misc: {
					values: [
						{ value: '1', label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
						{ value: '5', label: '5' },
						{ value: '6', label: '6' },
						{ value: '7', label: '7' },
						{ value: '8', label: '8' },
						{ value: '9', label: '9' },
						{ value: '10', label: '10' },
						{ value: '20', label: '20' },
						{ value: '30', label: '30' },
						{ value: '50', label: '50' },
						{ value: '100', label: '100' },
					],
				},
			},
		],
	},
	{
		id: 'DeepSeek',
		category: NodeletCategory.Processor,
		workflowCategory: WorkflowCategory.All,
		name: 'DeepSeek',
		internal: true,
		integration: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'query',
				name: 'query',
				type: NodeletInputType.String,
			},
			{
				id: 'context',
				name: 'context',
				type: NodeletInputType.Context,
			},
		],
		outputs: [
			{
				id: 'answer',
				name: 'answer',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'systemPrompt',
				fieldName: 'systemPrompt',
				label: 'System Prompt',
				type: 'TEXT_AREA',
				placeholder: 'System Prompt',
			},
			{
				name: 'prompt',
				fieldName: 'prompt',
				label: 'Prompt',
				type: 'TEXT_AREA',
				placeholder: 'Prompt',
				defaultValue: '{query}',
				description: 'use {xxx} to quote variables and use {query} to quote the input',
			},
			{
				name: 'model',
				fieldName: 'model',
				label: 'Model:',
				type: 'SELECT',
				placeholder: 'model',
				isDisplayed: true,
				defaultValue: 'deepseek-chat',
				misc: {
					values: [
						{ value: 'deepseek-chat', label: 'deepseek-chat' },
						{ value: 'deepseek-coder', label: 'deepseek-coder' },
					],
				},
			},
			{
				name: 'temperature',
				fieldName: 'temperature',
				label: 'Temperature:',
				type: 'SELECT',
				placeholder: 'Temperature',
				defaultValue: '0.7',
				misc: {
					values: [
						{ value: '0.1', label: '0.1' },
						{ value: '0.2', label: '0.2' },
						{ value: '0.3', label: '0.3' },
						{ value: '0.4', label: '0.4' },
						{ value: '0.5', label: '0.5' },
						{ value: '0.6', label: '0.6' },
						{ value: '0.7', label: '0.7' },
						{ value: '0.8', label: '0.8' },
						{ value: '0.9', label: '0.9' },
						{ value: '1', label: '1' },
					],
				},
			},
			{
				name: 'contextCount',
				fieldName: 'contextCount',
				label: 'Context Count:',
				type: 'SELECT',
				placeholder: 'Context Count',
				defaultValue: '1',
				misc: {
					values: [
						{ value: '1', label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
						{ value: '5', label: '5' },
						{ value: '6', label: '6' },
						{ value: '7', label: '7' },
						{ value: '8', label: '8' },
						{ value: '9', label: '9' },
						{ value: '10', label: '10' },
						{ value: '20', label: '20' },
						{ value: '30', label: '30' },
						{ value: '50', label: '50' },
						{ value: '100', label: '100' },
					],
				},
			},
		],
	},
	{
		id: 'Ollama',
		category: NodeletCategory.Processor,
		workflowCategory: WorkflowCategory.All,
		name: 'Ollama',
		internal: true,
		integration: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'query',
				name: 'query',
				type: NodeletInputType.String,
			},
			{
				id: 'context',
				name: 'context',
				type: NodeletInputType.Context,
			},
		],
		outputs: [
			{
				id: 'answer',
				name: 'answer',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'systemPrompt',
				fieldName: 'systemPrompt',
				label: 'System Prompt',
				type: 'TEXT_AREA',
				placeholder: 'System Prompt',
			},
			{
				name: 'prompt',
				fieldName: 'prompt',
				label: 'Prompt',
				type: 'TEXT_AREA',
				placeholder: 'Prompt',
				defaultValue: '{query}',
				description: 'use {xxx} to quote variables and use {query} to quote the input',
			},
			{
				name: 'model',
				fieldName: 'model',
				label: 'Model:',
				type: 'SELECT',
				placeholder: 'openai model',
				misc: {
					integrationFieldName: 'model',
				},
			},
			{
				name: 'temperature',
				fieldName: 'temperature',
				label: 'Temperature:',
				defaultValue: '0.7',
				type: 'SELECT',
				placeholder: 'Temperature',
				misc: {
					values: [
						{ value: '0.1', label: '0.1' },
						{ value: '0.2', label: '0.2' },
						{ value: '0.3', label: '0.3' },
						{ value: '0.4', label: '0.4' },
						{ value: '0.5', label: '0.5' },
						{ value: '0.6', label: '0.6' },
						{ value: '0.7', label: '0.7' },
						{ value: '0.8', label: '0.8' },
						{ value: '0.9', label: '0.9' },
						{ value: '1', label: '1' },
					],
				},
			},
			{
				name: 'contextCount',
				fieldName: 'contextCount',
				label: 'Context Count',
				type: 'SELECT',
				defaultValue: '1',
				placeholder: 'Context Count',
				misc: {
					values: [
						{ value: '1', label: '1' },
						{ value: '2', label: '2' },
						{ value: '3', label: '3' },
						{ value: '4', label: '4' },
						{ value: '5', label: '5' },
						{ value: '6', label: '6' },
						{ value: '7', label: '7' },
						{ value: '8', label: '8' },
						{ value: '9', label: '9' },
						{ value: '10', label: '10' },
						{ value: '20', label: '20' },
						{ value: '30', label: '30' },
						{ value: '50', label: '50' },
						{ value: '100', label: '100' },
					],
				},
			},
		],
	},
	{
		id: 'ChatResponse',
		category: NodeletCategory.Output,
		workflowCategory: WorkflowCategory.Chatbot,
		name: 'Chat Response',
		internal: true,
		image:
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAEF1JREFUeF7tnQmSIzcOReWTeeZktk/m8cnGZofYZmWlpFzwsZBPER1VdmWS4AceATIX/fLggwIoUFaBX8pajuEogAIPACYIUKCwAgBc2HmYjgIATAygQGEFALiw8zAdBQCYGECBwgoAcGHnYToKADAxgAKFFQDgws7DdBQAYGIABQorAMCFnYfpKADAxAAKFFYAgAs7D9NRAICJARQorAAAF3YepqMAABMDKFBYAQAu7DxMRwEAJgZQoLACAFzYeZiOAgBMDKBAYQUAuLDzMB0FAJgYQIHCCgBwYedhOgoAMDGAAoUVAODCzsN0FADgGjHwn8HM8fdfd8wf/743uv9t/udfOwe1Y7bH1VBqMSsBOJ/DO4C/PU37BKR6BA3kDjlgq9U+2T4AnxTM8PAOZvvZM2k0rGeGB9hn1BIdC8AiYV802wBtmbUSqGcU+uN58O9nTuLY6woA8HXtjpw5lsOzQvtKh56hKbuPRMrFYwD4onBvTutZth2yGrTv1CQ728ca305opOnspbGRTD+bAWYjRcnA14UE2uvajWc2mCmzL2oJwOeFA9zzmh05o6+Z2QA7otbzGAA+LhbgHtfq7pEtKwPyARUB+L1IDdpxU+qApBxiqAAgfxATgPcFItsaUmjQFCC/EBGAvwvTSrd+G6NB7NGEoQKAvBETgP8VhKxrSJq4KUBmE+tniAGumDZR81x+ejyWv5GDcllEl2OzS2fjVUtowHUkzKmrJUFeDWDKZSeaArtZCuSVACbrBlLl3PUyEK8C8J88GeSMUHx3S0A8O8CtZG7wzvLp76kaX3GzHdund1ltH3Hc/nd7O8hMj0FODfLMAFcumUdQ+++fwLSepPptpL3dymBPC/GsAFcrmRuc/RlZb1DPgj+CXemOtSkhng3gKrvMHdJ+M8JZiDIdX+2Bj//O9MrcmQDOXjJXyrJ3Jojmh+zl9jTZeBaAs8Lboc1eFt8B9t25/ZnejKX2FBDPAHBGeFcHdw/qjH4qD3F1gDNtVgHtsTyeDeTmt7YuLvmpDHAWeAH3WuhnKq/LQlwV4AzwAu41cLdnZQG5JMQVAc4A71SXImw4vN1KhtK6HMTVAI6Gt/ymx23M9A1Eg1wK4koAR8JLuawHd6+0jrr8VAbiKgBHzcqA6w/u2GPkTSElIK4AcBS8lMux8G5BjsjG6WMgO8BR8LJJlQfebknUo6GpIc4O8P+d46hE2eSsSbbuIib1tBN6ZoC9N61Sz7TZKAq2xxvitBN7VoC9HZR2hg0GJXP33jGSEuKMAHs6JqVTMlOT0DbPeElXpWUD2HOjIp0zEsJRxSRPiFNVa9kA9tq0At4qaB63c0mIMwHs5QDgPQ5FtSO9YijN0isLwF7CA281JM/bu1QsZQHYo3QG3vMwVD3DC+JwfsIN+CdCPMQG3qooXrfbI67CS+kMAKuzL/Beh6D6mR4Qh+5KRwOsFhh4qyN43351jIVm4UiApxb2ftzRgqEC6ttyw7JwJMDq0jlMVMPAoykbBdQ3CIVl4SiA1dmX0tkm8GdqRQ1xSMxFAazMviFCzhTpE49FnTjcq74IgJUiAu/E9BkNTbkedi+lIwBWZt+I8RjFFc04KqCE2DULewc82dcxSunqpQLK9bBrFvYGWJV9KZ2h9awCU2RhT4CV2ddzHGcDheNzKqDMwm4JxTPwyb45A3llq8onFS+Aywu1cpRPPnZVKe2ymVUdYLdSZfIgXnl4qlLaZTPLC2BF+Qy8K2NnO/ayWdgDYFX5DMC2Qbxya6osLC+jPQBWzG7AuzJumrEr4lReRnsATPmsCThatVWgZBZWA6wqn9V224YGrVVRQJGFpdWiGgQFwFJBqkQadkoUUGRhaRmtBlhRPqttlkQGjZZRoFTMqmGwFoPsW4aDsoYqymjZbrQSYMrnsjG8tOGKMhqAnyGlnHCWjloG/0UB6ywsWwcrgaB8hoqqCgDw4/EA4Krhi91lymhVBlasf2XrCOIVBTYKAPA/Gfg347BQTTbGZtLcJAqUKKNVUFgPnstHk1BRaBjWMSzZyFIBzPq3UKRi6q4CijLanDfzBp9SWAPM+hfKvBVQAGwexwqAFQNX2OkdEPRXT4H0iUgBhjXAkrVDvVjC4gAFrNfBJTKw9SUkNrACIpcufygAwAaBAMAGItLEJQXSJyNFCZ1+0JdcyUkrKpA+lgF4xbBkzEcVSL+fowA4/brhqPc4bnkFANggBMx37gxsook1FABgAz8DsIGINHFJgSUBtr74rSjzL3mTk5ZUIHU8K+BIPeAlQ5BB31EgdTwD8B3Xcu4KCiwHMLvQK4T1GmNccg0MwGsE9wqjBGADL7MLbSAiTVxSYEmA099+dsmVnLSiAuljWbGJlX7QK0YiY76kQPpYBuBLfuWkRRRYEuD064ZFgo9h3lcAgO9r+OCNHAYi0sQlBdJfUVGU0NYZuCmvsPOSRzlpKQWsb+Iwv6KiAEMBsPnAlwpDBntVAWuAzXkzb/CplPXAowBuk1H79+vzZxteK+n/eo6zrZH43Fcgo87W619JJakC2Hrt4L0ObgHVvhqm/Xz34X1d9+DNrDMA3/Ptt7NVk822oyuOA+Tzzs6us3USksSICoqq6+ArQdVDV+Kg81yUOOMOHF46Wy8DJXYD8Nd4v+s071K/BK0bI+/A25tS74ncmchf+URiswrgNggLR41iqOGwdJrEWRVpHWy2rMoqxUKXQMKapNGnxdYAS3bxht1k6+8zlpRMRSG2hNcjC9+txLZukk04SoArOc0y+47OA+LHo5q2iriVxUE1gFUzmaJaYHNLB2/TVhULiglHtqRSAtxEti5FVGW0ws5tGSWbhROW1Uev7941XRG/ilhQ2PlDO1nDwnWwYjZTOG0vOGeH2Atc1caQIvuqKgUXgBXrCYUgyhJ6FZAVwf8uQyviQDGRSydtdQZWANycap2FvYNvpvWxd9ZVaaeKAetY/TKpqQFWXA9WbGCoJpoja7w2Q7dPtQcjosCtBrCUMWnjT6VVcFjPbN5l9N61wvaUU3aQo8FtulmXparsa23nt4TgAbBqN9p6DaSaaI5k4b0d60xZOQO0o0bWcasC2NrOMIBV2c16hlM58grEY6noDXN/jLLfnfbpsco74zt7rrXPVRO3tZ27OslnCHEZ3Zq3HkNGiEfn9TVzq0DaP4tPZmC3Y7deYqj8bb3ECwW4da7KwtaldM921vdGW4C218YIcX9TSD9u/FuHtL1dZPxkyq7vNFJkNBW8ClvDAVaJ1QammO2U9qpgnrVdhX+bVorrvq3dKQFWCqbIws1e1fpoVtCsx9X82mCwWiqM9iknaOtl3Utd3Tp6WqAqo9WzntJu66CfpT3VpKxeIrll3zYQb4DVGU1VaqmdPgt0VuNQQ6CckF2Zcu3s6V1l6aKctYHYCs/37ajhVcaf2vZvykUArFwLt7aB2Ac0RS9qAJTwRlS07iV0d7q6lFYHAtnYFl/lZtVMMZcmAzdDlOsQ9aZWF1I9o9tikq81D3D7qFWXjHr7IdVsSKfPEauzcOtGuak14gDI5ycHjyqpWzVDsthVOBJgjyysXg+Povbv96lyB9d55GzO8My6XkudMI7COh5iQV3aeELsFTA2KPm34lUReS5xPCuJVGtgT5G9IQbkr6EWEeQey5qIcX1RNkMG9iilWx8REK8Osne57JkUWl/h/IQb4LihFQnxaiBHZiaPzNv8GTnGn1k4C8CeAR6Vicfs0H6fbbMrKttGXA2IjqGUAHuV0n3w3hsqe1tGXtlCtV3Voe3VjaqfI+16apkhdn5okikDdyepd6XHYEhRBj0fW9y+FeNI0EYc06BtLw6wfCPI3XF4wpslZtIC7HGDR0aIR5v6NeXoUrs/hzu+xucubNbnq2/SSB0rGTOw53q4OyfNmuZNdPd3QbVX4qheg1MB2FEiT3hTxkhWgCMgbn2mKo8OpqoR5i3Y4/uv+vuytm+3ULzt4qDplw/zrtKyLjdTroGjZtjeb0WIL5NQ8ETP9W6XJ82m1dZfmTNwszVipm39ZrgkUpAtuckR8Kae0LMDHAlx1ZJaTlFQB8C7I3wFgKPWw6l3H4MgiuoWeF8oXwXgDBD365/W3wwQBUWlfj13m0tVXpUAzgBxKedWIvSDrZ4396S8XPRKn2oAZ4EYkP1mB+/yuRQTpYwdYsbbqe/CNfUupR9nsp68yueSVx6qApwpE/fI7bcbska2ZdkD4FJl8yhvZYAzQtxsYrOrFsClK6jqALdQibrZ40iYkpWPqPT+GGUGLg1vk20GgLNDTIl9D2LVfkd5eGcCuIeIytn3QnD/7P61mRUfJlDo8apNVYVVdt070xp4z+mVIN5m50wPyXtC+qkvVRldPgvPUkJvA6DN2u2dU6rnZj8FnMXf+2ZY3xhbOVOrsnDTNu2TRkeCaFaAK5bUR/w17nJvjz/7nO+rye3dM8Vjn/35Yq/LZqq7sUqX0rMD3AKuYkl9FOYsx3mUoko/etgv8dUKAPdd6uoltSQAjBtVg6DKwmVL6VUAnrmkNmbQpDkVyKrNrL40aevhUp/VAO7ZuG9ylXJWQWOtQVZuZjV5re2Vu2xFgMnG8rD60oE1FMq1cLlSemWAAdkf5L6peLdn5Vq41K40AP8bSuqZ/W7QznK+xf3hlNLPaADg71gAst9Ucae8Vm5olVkPA/B+sAKxH8QdlrO3kaqzcIn1MAC/D9R+l9FsXwXqi+fx3s4+S63OwunXwwB8LLj6l40B8jG9LI46CrNyQyt9KQ3A50ON8vq8ZnfPGB/s2N577VFKp+UkrWF3Pe5wPuW1g8hvuhi/8lR9Y86dzTapSgBsI2+DWfm1nzZW0sodBVKyktKoOyonOJfMnMAJAhNSZmEAFnh6aLJvfpGdtTp7tZ6Ol3QGeXkiqB+yc5DwRt2me3sHABt59kIzPTv3U8nSF0R0PgWAnQWv2N0INlDn8iAA5/JHKWvGd1Xtvc+qwT5+Pr3Q791L8vr7rnp77Vj1pZoKzgDgCl7CxrcKrHwjCwADxzQKrAgyAE8TvgykK7ASyABM3E+pwCoPe6S7apPOoCnDe61BzZqRuRNrrThefrSzgZwy2aU0avnQn0uAGe4+S5l9W5gA8FywZB5N5XVyWk7SGpY5ErHttgKVYE6bfcnAt+OQBgwUyFxip4YXgA2ijyZMFegwR98D3m4dbfCm/05mSmjT+KMxYwXGBzu8XiiY/k2Uo8YAbBxxNCdXQJWly2RdAJbHGB04KtCfuto+fTU+nbX9Wy+N21NX/ff05fKepmRgx0ijKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVACAHcWmKxSwVgCArRWlPRRwVOBvh4slHgH6+tcAAAAASUVORK5CYII=',
		inputs: [
			{
				id: 'output',
				name: 'output',
				type: NodeletInputType.String,
			},
		],
		outputs: [],
		configDefinitions: [],
	},
	{
		id: 'Email',
		category: NodeletCategory.Output,
		workflowCategory: WorkflowCategory.Automation,
		name: 'Email',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'mailContent',
				name: 'mail content',
				type: NodeletInputType.String,
			},
		],
		outputs: [],
		configDefinitions: [
			{
				name: 'Email Address',
				fieldName: 'mailAddress',
				label: 'Email Address:',
				type: 'INPUT',
				placeholder: '',
			},
			{
				name: 'Mail Header',
				fieldName: 'mailHeader',
				label: 'Mail Header:',
				type: 'INPUT',
				placeholder: '',
			},
		],
	},
	{
		id: 'DisplayOnScreen',
		category: NodeletCategory.Output,
		workflowCategory: WorkflowCategory.Automation,
		name: 'Display On Screen',
		internal: true,
		image:
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAADuhJREFUeF7tnQuS5DQQBYeTLZwMOBnsyWDFtsHMdrctvXqlX3YEAcyoZDlV6ZI/7fnpgw8EIDAtgZ+mHTkDhwAEPhCYJIDAxAQQeOLJY+gQQGByAAITE0DgiSePoUMAgckBCExMAIEnnjyGDgEEJgcgMDEBBJ548hg6BBCYHIDAxAQQeOLJY+gQQGByAAITE0DgiSePoUMAgckBCExMAIEnnjyGDgEEJgcgMDEBBJ548hg6BBCYHIDAxAQQeOLJY+gQQGByAAITE0DgiSePoUMAgckBCExMAIEnnjyGDgEEJgcgMDEBBJ548hg6BBCYHIDAxAQQeOLJY+gQQGByAAITE0DgiSePoUNgRYF/fkzr8e8vp2k+fsbMr03gz9PufT39d/n5+XfTU1hB4EPKX79NDoJOn5IpO/D7Yyu/pWzNuJFZBS6iFmHLB2mNCbJB16Uilyo9ZXWeTeBDXKTdwKxOu1iq8zSVeRaBEbdTNm+62WmW2KMLjLibGjTIbg8v8sgC/8H57SBpzDCGXVaPKHCpukVePhAYjcAvo92GGk3gcvHguLo82uQxHggUAkNV45EERl4EmYXAMBKPIjDnu7OkLuM8CAwhcW+BucqMEDMTKA9/FJG7PZ7ZW2Aq78zpy9gLgSJvubjV5dNTYM55u0w5GzUQ6CZxL4GR15BFdNmVQJdz4h4CI2/XPGPjRgLpEmcLzEMaxuyh6yEIpD7skS3wX0MgZhAQ8BJI8yptQ994sXT2Jg29j0Mg7aJWlsDIO05yMZIcAilL6ZUFPm6uH18JO+7Z5UwfW+lJ4PN70Xo8X59ShTMEzq6+x5Mx3Z6O6Zm5bPstgexctFfhlQROv4SPLNMSyBLZXoXdAmeAskOaNk0Z+BWBjPy0VmG3wO7bRlTdqxTl91cE3BJbC4xTYPdDG8h7lZr8/i4Bt8S2KuwU2AkFee+mJu3uEnDmq60KOwV2fVUQee+mJO1qCbgknlJgx/kv8tamJO1rCbgKj2UZ7arAriOZa7y1k0z7tQk4is/2AlN915ZmpL1zFCDLMtpV0RxHMNdYR0ocxjIOgSly2CGF4/YR1XecxN5lJI4qHL6Mdgjs2HHHOHdJRPazjYCjECFw21wQBYEmAtFXpMNXko7KFl2Bw3e6aSoJ2pHAlgIPv9M7ZiL73EQgehkdfiXaUYGjBQ4/b2iaSoJ2JIDAAbOOwAEQ6aKJwJYCR98/c6wSmmaToC0JDJ3PDjmG3uEtU5CdVggMnc8IrEwtsTsQQGBxlh0HGXFIhG9EAIHFyUZgESDhEgEElvB9fCCwCJBwiQACS/gQWMRHuEgAgUWAVGARIOESAQSW8FGBRXyEiwQQWARIBRYBEi4RQGAJHxVYxEe4SACBRYBUYBEg4RIBBJbwUYFFfISLBBBYBEgFFgESLhFAYAkfFVjER7hIAIFFgFRgESDhEgEElvBRgUV8hIsEEFgESAUWARIuEUBgCR8VWMRHuEgAgUWAVGARIOESAQSW8FGBRXyEiwQQWARIBRYBEi4RQGAJHxVYxEe4SACBRYBUYBEg4RIBBJbwUYFFfISLBBBYBEgFFgESLhFAYAkfFVjER7hIAIFFgFRgESDhEgEElvBRgUV8hIsEEFgESAUWARIuEUBgCR8VWMRHuEgAgUWAVGARIOESAQSW8FGBRXyEiwQQWARIBRYBEi4RQGAJHxVYxEe4SACBRYBUYBEg4RIBBJbwUYFFfISLBBBYBEgFFgESLhFAYAkfFVjER7hIAIFFgFRgESDhEgEElvBRgUV8hIsEEFgESAW+Bvjzx8dH+ad8vpyaHz/78/Gzr6fflZ8dP7/ewr4tEFicewR+DrDI+etJ3FbMvz8Cf2vtYPE4BBYnGIH/Axgl7aspQeYfySAwAosEvi+PI6rt3YEUkanI32kh8N2sedFu9wpcRCry9vggMgLLeberwNlV99VElQtd5eLXrhWZCiwqvKPAPavuu/PjHSVGYASuIvBHwJXlqg1WNN5xSY3AFQnyrOlOFXhkeY+5KUvqX8Q5nSkcgcXZ2kXgGeTdUWIERuBLAiOe814NepdKjMBXmXDx+9Ur8IzyHlO2wzkxAiPwSwIzy3vsVDkfXvmZagRG4JcEZjrvfXefeOWLWgiMwE8JrFB9d1hKIzACPyUQnRgiZjl81aV09DyFXtMJ7eyRAkPvsJymMR2sVH1Xv7U0dD4jcIyQNb2sKO/KF7QQuCa7n7R1HGTEIUnhKwu84r1hBJbSfb13YkUnhIg3PHy1A270fIXyCe2Mc+BLGTKqb6mCx5s1jvuz53dmub9bvNrFLAS+TOv3DRwHGXFIzeFOgQ9x7zxU4R7HSveFEbg53b8HriRwdDIo92GdEjNnr5M+lE1oZyyh3x6qyjK2PHkV/VGeR3ZJvNIyOvqgG+pcaGcI/NZNhyyKvMdgHY9zRowr+kDX2h8Ct5J7xDkOMuKQmsIdAkewcawMEJgl9L8EIpK0ybjgoGiBIyWJrsIr3Q+mAosirCJwtCSRAkdXYQSmAi9XgaMFjrxQhMCvhaMCU4H/ITB0IkwwPjGNmsOHnjfH8nToHW6eRj1wdC6jj0+fgbYehuaCwG2T2hLFErqFWv8YBBbnwHGQEYfUFD6ywNFXyLmIxUUsLmJdHCYiJYkWOPIKedPRMjCICizCXKUCR0tSsEZdiY5OUgSmAi9XgR0CR1Rhx7gQGIGXEzj6XusBSJHFIW/kykBcvIWER69OQleUoZ09cA29wyFT2t5JNBtFYpe8ZUyOvGqnrkVGz1kom9DOEPgyU6KvRJ83eLcSu/9w+N1xXMIapAECixPhOMiIQ2oOdy2jP4tc/r+cH59fqVN+Vl6nU8bg/CDwe7qh+RzaGRX4lhfRR/RbG01s5MipxOH/sKno+QrlE9rZY9ejl4lRt0p6JsF529F8RtmvMo7Vqm/0iinirsH/5huB89M/Oiny9+D1FhH4/Wwg8EjZKoxlxSq8mrxleqOv1IczclTg6J0OP2oJ4kWFrliFHbkUxbu1n+hcnkLg6ORcUWDH0b01SSPiwhMzYlABfURfwArn5DhqRgtc5mG1C1lHbq2wlF71AOvI420FJkkCyompi/CkNI2zttvo5bOlEDkqcBlo9NJjVYFnX0qvKq8jh0uf4b6Fd/g4zDmWhisni4NXbcWpbb/yfDiqr4WXS2DH+YNlCVKbtcb2M0m88orIVX0R+PFs70p/+e7z8WAGiVeX11F9LctnW6fGZXTp2nIkM1bW2q5dCVQ7jmftkbeNoo2bawlddtO1jEbitiRSozhwthO0sZtV4F0k/pLw9b+rtKz5w+FXfY36e2exsV67cQpcBu4+p7Md2QbKtJ5LavjGJILNM1vHj/12H9l2qMRHCmWKvEPVzSgw9vx0C5wFyQ4q5kAs91IkLp/yZg3HZxdxsw6GtotXx+RnCJxRhc/JvMOyr+xvlMy7SHswcx38nh1Q7bmYIXBmFd5R5LLP5SB5ftdVufh1/Lz8+3g3Vvnvr4/fnd+Z5ajmI/WZVXHT8y9L4OwqnA5ypGxlLP8ScL+B8x3qFLdSNvLYyx5HwQOwfSmDNEMSiP5Szd2dTMu3TIHLzvcCWra96neK7ybVbu16Fow0r9I2dDonK/eGe3zsVwR77BTbfEqgp7xp1bfsebbAZZs94VKF9zC+10ovVd5eAveUmCq8vsC9Lpimy9tT4J4S91h1rK/NOHvYY4XXRd7eApftu5+VfpZWLKPHkc0xkmyBu67qRqhG2RIjsEObcfrMzqeuDnXd+OnKdMZfzTtSbIR9Hifd1xtJ1jnwEI+gjpTMWUufEfb5/Ojj8dhjUcn9pz+jdD0ezTweyyz9jvJoZobA3c55P0/gCMl8HpNb4p7gez7WFyXunX4K4+Mi5Z32jjbO20g9c+gHVqMJfFQh15I6G/4u0r6SsJfMjkIwxJJ59ArsrMaZ8u4u7uc8y2R/bDvyYlaP8d9amYxYgV0SZ+2r4+h/azInaJQpQsS58JBV9zzPWUmt5pb65fWMxKHq3pvlIkW5+HXM6b2otlatB9PhxT1wzCLwMd5akbMmojVR2tJyjaiMg+o5b+68iSMrX8JmcDaBPy+vX712NfMoH3muFTaxk3SULXHB8jlnjlwZ5TZY1dTNLPB5R8/3T8+vj6mC0dAYeRugfQrp9ShiyZnMXNFJPelhFYEtcC46Rd446r0kjtuDTj0hcBt4znnbuL2LQuIGpghcDw1565ndjcg8J747pqHbIXDd9CBvHa+W1nxbrIIaAlfA6vT95boRzt+apXTFHCLwfVhU3/us1JYspW8SROCboDq/Evf+KNdpyVL6xlwi8A1I35pQfe9ximzFUvoGTQS+hoS814xcLajCF2QR+Dr1EPiakasFVRiB5dxyvt1BHtwGHVBk3kwycN4bkFF9j2/AlJHM8mzu+Z1ed77loxxnWEYjcHP+OAWe7qtrbyi6ORWJ+TwhQAV+nxau5fOK9zmdEpOnL/IUMK8Fjngly7PeV5T32E+XxCyjEbh6BeZIxpXlPQA7vma5A7fqBC0BVODX2BwC78DbsXJBYCpw9QEuWuCdkjC6CnM/GIGrBY5Owp0Ejq7CCIzA3QXe6UIMAlenW1vADudkbWQ+PqJvIe3GGn6tmVcRt1tSVaBB4BpYT9oisAjwTjgCv6YUeQ684zkc/O4YKLZB4JzbSDtdwHI81LEjv1tqI3DOk1g7JmDkhawd+SHwLQLvG0UsA3dOPvgFJOG7LqjA7wFHVJGdGcMPgc0ErrtXnsjaufpGnAvD7yI/d64O1+r+16JFYpIPfjU51tQWgeuw3RF5pS/q19G5bg2/a0ZVLRC4Ctc/jY8/Mn7+O7NT/43ZegRSBPwkfP8PRuBAmHQFgWwCCJxNnO1BIJAAAgfCpCsIZBNA4GzibA8CgQQQOBAmXUEgmwACZxNnexAIJIDAgTDpCgLZBBA4mzjbg0AgAQQOhElXEMgmgMDZxNkeBAIJIHAgTLqCQDYBBM4mzvYgEEgAgQNh0hUEsgkgcDZxtgeBQAIIHAiTriCQTQCBs4mzPQgEEkDgQJh0BYFsAgicTZztQSCQAAIHwqQrCGQTQOBs4mwPAoEE/gap1csPZxGrVAAAAABJRU5ErkJggg==',
		inputs: [
			{
				id: 'displayContent',
				name: 'display content',
				type: NodeletInputType.String,
			},
		],
		outputs: [],
		configDefinitions: [],
	},
	{
		id: 'SaveToFile',
		category: NodeletCategory.Output,
		workflowCategory: WorkflowCategory.Automation,
		name: 'Save To File',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'output',
				name: 'output',
				type: NodeletInputType.String,
			},
		],
		outputs: [],
		configDefinitions: [
			{
				name: 'fileType',
				fieldName: 'fileType',
				label: 'File Type:',
				type: 'SELECT',
				placeholder: '',
				isDisplayed: true,
				defaultValue: 'txt',
				required: true,
				misc: {
					values: [
						{ value: 'txt', label: 'TXT' },
						{ value: 'md', label: 'MarkDown' },
						{ value: 'pdf', label: 'PDF' },
					],
				},
			},
			{
				name: 'fileName',
				fieldName: 'fileName',
				label: 'File Name:',
				type: 'INPUT',
				required: true,
				placeholder: 'Enter File Name',
			},
			{
				name: 'folderPath',
				fieldName: 'folderPath',
				label: 'Foler Path:',
				type: 'FOLDER_PATH_CHOOSER',
				placeholder: '',
				required: true,
			},
		],
	},
	{
		id: 'FireCrawl',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.All,
		name: 'FireCrawl',
		internal: true,
		integration: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'content',
				name: 'content',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'URL',
				fieldName: 'url',
				label: 'URL:',
				type: 'INPUT',
				required: true,
			},
		],
	},
	{
		id: 'URLLoader',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.All,
		name: 'URL Loader',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'content',
				name: 'content',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'URL',
				fieldName: 'url',
				label: 'URL:',
				type: 'INPUT',
				required: true,
			},
		],
	},
	{
		id: 'YoutubeLoader',
		category: NodeletCategory.Input,
		workflowCategory: WorkflowCategory.All,
		description: 'Loads the transcript of a Youtube video',
		name: 'Youtube Loader',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [],
		outputs: [
			{
				id: 'transcript',
				name: 'transcript',
				type: NodeletOutputType.String,
			},
		],
		configDefinitions: [
			{
				name: 'URL',
				fieldName: 'url',
				label: 'URL:',
				type: 'INPUT',
				required: true,
			},
		],
	},
	{
		id: 'SplitText',
		category: NodeletCategory.Processor,
		workflowCategory: WorkflowCategory.All,
		description: 'Split text into multiple chunks',
		name: 'Split Text',
		internal: true,
		image:
			'data:image/png;base64,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',
		inputs: [
			{
				id: 'inputText',
				name: 'inputText',
				type: NodeletInputType.String,
			},
		],
		outputs: [
			{
				id: 'splitText',
				name: 'split text',
				type: NodeletOutputType.StringArray,
			},
		],
		configDefinitions: [
			{
				name: 'Chunk Size',
				fieldName: 'chunkSize',
				label: 'Token limit per text chunk:',
				type: 'NUMBER',
				defaultValue: 1000,
				isDisplayed: true,
			},
		],
	},
];
