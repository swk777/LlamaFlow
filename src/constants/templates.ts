import { IWorkflowCategory } from '@/type/workflow';

export const Templates = [
	{
		id: 'SummarizeWebContent',
		name: 'Summarize Web Content',
		category: IWorkflowCategory.Automation,
		description: 'Summarize web content',
		lastModified: '2024-06-05 04:46 PM',
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
];
