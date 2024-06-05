import { IWorkflow, IWorkflowCategory } from '@/type/workflow';
import { format } from 'date-fns';

export const getInitialWorkflow = (id: string): IWorkflow => ({
	id,
	name: 'New Workflow',
	category: IWorkflowCategory.Chatbot,
	description: '',
	lastModified: format(new Date(), 'yyyy-MM-dd hh:mm a'),
	data: {
		nodes: [],
		edges: [],
	},
});
