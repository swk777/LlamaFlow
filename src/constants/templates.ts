import { IWorkflowCategory } from '@/type/workflow';

export const Templates = [
	{
		id: 'SummarizeWebContent',
		name: 'Summarize Web Content',
		category: IWorkflowCategory.Automation,
		description: 'Summarize web content',
		data: {
			nodes: [
				{
					id: '3f5078f2-b801-4e37-a2c4-3f71234e1524',
					type: 'internalNodelet',
					position: {
						x: 391.7421875,
						y: 225,
					},
					data: {
						label: 'Display On Screen',
						nodeletId: 'DisplayOnScreen',
						config: {},
					},
					width: 96,
					height: 80,
					selected: false,
					positionAbsolute: {
						x: 391.7421875,
						y: 225,
					},
					dragging: false,
				},
				{
					id: '46d6fa15-d74a-4b75-8a02-398c1506851d',
					type: 'internalNodelet',
					position: {
						x: -10.4296875,
						y: 178,
					},
					data: {
						label: 'URL Loader',
						nodeletId: 'URLLoader',
						config: {},
					},
					width: 96,
					height: 80,
					selected: false,
					positionAbsolute: {
						x: -10.4296875,
						y: 178,
					},
					dragging: false,
				},
				{
					id: 'fe540a8d-cbf2-4371-a79e-d3b92bf79b24',
					type: 'internalNodelet',
					position: {
						x: 180.7421875,
						y: 197,
					},
					data: {
						label: 'Ollama',
						nodeletId: 'Ollama',
						config: {
							temperature: '0.7',
							contextCount: '1',
							model: 'llama3',
							systemPrompt: 'summarize the content',
						},
					},
					width: 96,
					height: 80,
					selected: true,
					positionAbsolute: {
						x: 180.7421875,
						y: 197,
					},
					dragging: false,
				},
			],
			edges: [
				{
					source: '46d6fa15-d74a-4b75-8a02-398c1506851d',
					sourceHandle: 'content',
					target: 'fe540a8d-cbf2-4371-a79e-d3b92bf79b24',
					targetHandle: 'context',
					id: 'reactflow__edge-46d6fa15-d74a-4b75-8a02-398c1506851dcontent-fe540a8d-cbf2-4371-a79e-d3b92bf79b24context',
				},
				{
					source: 'fe540a8d-cbf2-4371-a79e-d3b92bf79b24',
					sourceHandle: 'answer',
					target: '3f5078f2-b801-4e37-a2c4-3f71234e1524',
					targetHandle: 'displayContent',
					id: 'reactflow__edge-fe540a8d-cbf2-4371-a79e-d3b92bf79b24answer-3f5078f2-b801-4e37-a2c4-3f71234e1524displayContent',
				},
			],
		},
	},
	{
		id: 'TranslationAgent',
		name: "AndrewNG's Translation Agent",
		category: 'Automation',
		description: '',
		data: {
			nodes: [
				{
					id: '8358d3ad-2807-4b8c-b8d8-e123c68f90b3',
					type: 'internalNodelet',
					position: {
						x: 68.88786425475621,
						y: 151,
					},
					data: {
						label: 'Translation Content',
						nodeletId: 'TextAreaInput',
						config: {},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 68.88786425475621,
						y: 151,
					},
				},
				{
					id: 'ce0e4a4e-3718-4154-ae72-79259005dce5',
					type: 'internalNodelet',
					position: {
						x: -59.2285750211031,
						y: 710.0528351795367,
					},
					data: {
						label: 'source language',
						nodeletId: 'TextInput',
						config: {
							variables: {
								output: 'sourceLang',
							},
						},
					},
					width: 96,
					height: 80,
					selected: false,
					positionAbsolute: {
						x: -59.2285750211031,
						y: 710.0528351795367,
					},
					dragging: false,
				},
				{
					id: '516b30f5-7854-4660-8710-329d9c05c4a3',
					type: 'internalNodelet',
					position: {
						x: 135.08670396402886,
						y: 709.2426079491609,
					},
					data: {
						label: 'target language',
						nodeletId: 'TextInput',
						config: {
							variables: {
								output: 'targetLang',
							},
						},
					},
					width: 96,
					height: 80,
					positionAbsolute: {
						x: 135.08670396402886,
						y: 709.2426079491609,
					},
					selected: true,
					dragging: false,
				},
				{
					id: '9f1209f3-1674-4630-a1d5-2960cb900f93',
					type: 'internalNodelet',
					position: {
						x: 304.50703470391716,
						y: 714.3919666807354,
					},
					data: {
						label: 'country',
						nodeletId: 'TextInput',
						config: {
							variables: {
								output: 'country',
							},
						},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 304.50703470391716,
						y: 714.3919666807354,
					},
				},
				{
					id: 'a3823abf-d641-480c-8d2a-abbb17f52bb1',
					type: 'internalNodelet',
					position: {
						x: 328.3509770355965,
						y: 365.44800307543164,
					},
					data: {
						label: 'OpenAI',
						nodeletId: 'OpenAI',
						config: {
							prompt:
								'This is an {sourceLang} to {targetLang} translation, please provide the {targetLang} translation for this text. Do not provide any explanations or text apart from the translation.\\n{sourceLang}: {query}\\n\\n{targetLang}:',
							model: 'gpt-4-turbo',
							temperature: '0.3',
							contextCount: '1',
							systemPrompt: 'You are an expert linguist, specializing in translation from {sourceLang} to {targetLang}.\n',
						},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 328.3509770355965,
						y: 365.44800307543164,
					},
				},
				{
					id: '338122aa-5e2b-4eb1-9d81-8e3f77703e63',
					type: 'internalNodelet',
					position: {
						x: 516.2427010777319,
						y: 493.23509811040833,
					},
					data: {
						label: 'OpenAI',
						nodeletId: 'OpenAI',
						config: {
							prompt:
								"Your task is to carefully read a source text and a translation from {sourceLang} to {targetLang}, and then give constructive criticism and helpful suggestions to improve the translation. The final style and tone of the translation should match the style of {targetLang} colloquially spoken in {country}.\\n\\nThe source text and initial translation, delimited by XML tags <SOURCE_TEXT></SOURCE_TEXT> and <TRANSLATION></TRANSLATION>, are as follows:\\n\\n<SOURCE_TEXT>\\n{sourceText}\\n</SOURCE_TEXT>\\n\\n<TRANSLATION>\\n{query}\\n</TRANSLATION>\\n\\nWhen writing suggestions, pay attention to whether there are ways to improve the translation's\\n(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text),\\n(ii) fluency (by applying {targetLang} grammar, spelling and punctuation rules, and ensuring there are no unnecessary repetitions),\\n(iii) style (by ensuring the translations reflect the style of the source text and takes into account any cultural context),\\n(iv) terminology (by ensuring terminology use is consistent and reflects the source text domain; and by only ensuring you use equivalent idioms {targetLang}).\\n\\nWrite a list of specific, helpful and constructive suggestions for improving the translation.\\nEach suggestion should address one specific part of the translation.\\nOutput only the suggestions and nothing else.",
							model: 'gpt-4-turbo',
							temperature: '0.3',
							contextCount: '1',
							systemPrompt:
								'You are an expert linguist specializing in translation from {sourceLang} to {targetLang}. You will be provided with a source text and its translation and your goal is to improve the translation.',
						},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 516.2427010777319,
						y: 493.23509811040833,
					},
				},
				{
					id: 'ec68d026-dc1c-44f6-8f99-eeb6e8b5d090',
					type: 'internalNodelet',
					position: {
						x: 725.8459672506528,
						y: 615.9550481346429,
					},
					data: {
						label: 'OpenAI',
						nodeletId: 'OpenAI',
						config: {
							prompt:
								'Your task is to carefully read, then edit, a translation from {sourceLang} to {targetLang}, taking into account a list of expert suggestions and constructive criticisms.\\n\\nThe source text, the initial translation, and the expert linguist suggestions are delimited by XML tags <SOURCE_TEXT></SOURCE_TEXT>, <TRANSLATION></TRANSLATION> and <EXPERT_SUGGESTIONS></EXPERT_SUGGESTIONS> as follows:\\n\\n<SOURCE_TEXT>\\n{sourceText}\\n</SOURCE_TEXT>\\n\\n<TRANSLATION>\\n{translation1}\\n</TRANSLATION>\\n\\n<EXPERT_SUGGESTIONS>\\n{query}\\n</EXPERT_SUGGESTIONS>\\n\\nPlease take into account the expert suggestions when editing the translation. Edit the translation by ensuring:\\n(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text),\\n(ii) fluency (by applying {targetLang} grammar, spelling and punctuation rules and ensuring there are no unnecessary repetitions),\\n(iii) style (by ensuring the translations reflect the style of the source text)\\n(iv) terminology (inappropriate for context, inconsistent use), or\\n(v) other errors.\\n\\nOutput only the new translation and nothing else.',
							model: 'gpt-4-turbo',
							temperature: '0.3',
							contextCount: '1',
							systemPrompt: 'You are an expert linguist, specializing in translation editing from {sourceLang} to {targetLang}.',
						},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 725.8459672506528,
						y: 615.9550481346429,
					},
				},
				{
					id: 'bb97a6b2-b657-432f-b1a8-0478695e3d35',
					type: 'internalNodelet',
					position: {
						x: 979.0572446349543,
						y: 625.2794783218407,
					},
					data: {
						label: 'Display On Screen',
						nodeletId: 'DisplayOnScreen',
						config: {},
					},
					width: 96,
					height: 80,
					positionAbsolute: {
						x: 979.0572446349543,
						y: 625.2794783218407,
					},
					selected: false,
					dragging: false,
				},
				{
					id: '033aebb0-642b-4cc3-9d04-924386add749',
					type: 'internalNodelet',
					position: {
						x: 979.858491103877,
						y: 412.9144673071599,
					},
					data: {
						label: 'reflection',
						nodeletId: 'DisplayOnScreen',
						config: {},
					},
					width: 96,
					height: 80,
					positionAbsolute: {
						x: 979.858491103877,
						y: 412.9144673071599,
					},
					selected: false,
					dragging: false,
				},
				{
					id: 'ee8e47b9-a786-4f48-95d3-9d48e131d36f',
					type: 'internalNodelet',
					position: {
						x: 971.3353073856023,
						y: 137.17086105040104,
					},
					data: {
						label: 'first translation',
						nodeletId: 'DisplayOnScreen',
						config: {},
					},
					width: 96,
					height: 80,
					selected: false,
					dragging: false,
					positionAbsolute: {
						x: 971.3353073856023,
						y: 137.17086105040104,
					},
				},
			],
			edges: [
				{
					source: '8358d3ad-2807-4b8c-b8d8-e123c68f90b3',
					sourceHandle: 'output',
					target: 'a3823abf-d641-480c-8d2a-abbb17f52bb1',
					targetHandle: 'query',
					id: 'reactflow__edge-8358d3ad-2807-4b8c-b8d8-e123c68f90b3output-a3823abf-d641-480c-8d2a-abbb17f52bb1query',
				},
				{
					source: 'a3823abf-d641-480c-8d2a-abbb17f52bb1',
					sourceHandle: 'answer',
					target: '338122aa-5e2b-4eb1-9d81-8e3f77703e63',
					targetHandle: 'query',
					id: 'reactflow__edge-a3823abf-d641-480c-8d2a-abbb17f52bb1answer-338122aa-5e2b-4eb1-9d81-8e3f77703e63query',
				},
				{
					source: '338122aa-5e2b-4eb1-9d81-8e3f77703e63',
					sourceHandle: 'answer',
					target: 'ec68d026-dc1c-44f6-8f99-eeb6e8b5d090',
					targetHandle: 'query',
					id: 'reactflow__edge-338122aa-5e2b-4eb1-9d81-8e3f77703e63answer-ec68d026-dc1c-44f6-8f99-eeb6e8b5d090query',
				},
				{
					source: 'ec68d026-dc1c-44f6-8f99-eeb6e8b5d090',
					sourceHandle: 'answer',
					target: 'bb97a6b2-b657-432f-b1a8-0478695e3d35',
					targetHandle: 'displayContent',
					id: 'reactflow__edge-ec68d026-dc1c-44f6-8f99-eeb6e8b5d090answer-bb97a6b2-b657-432f-b1a8-0478695e3d35displayContent',
				},
				{
					source: '338122aa-5e2b-4eb1-9d81-8e3f77703e63',
					sourceHandle: 'answer',
					target: '033aebb0-642b-4cc3-9d04-924386add749',
					targetHandle: 'displayContent',
					id: 'reactflow__edge-338122aa-5e2b-4eb1-9d81-8e3f77703e63answer-033aebb0-642b-4cc3-9d04-924386add749displayContent',
				},
				{
					source: 'a3823abf-d641-480c-8d2a-abbb17f52bb1',
					sourceHandle: 'answer',
					target: 'ee8e47b9-a786-4f48-95d3-9d48e131d36f',
					targetHandle: 'displayContent',
					id: 'reactflow__edge-a3823abf-d641-480c-8d2a-abbb17f52bb1answer-ee8e47b9-a786-4f48-95d3-9d48e131d36fdisplayContent',
				},
			],
		},
	},
];
