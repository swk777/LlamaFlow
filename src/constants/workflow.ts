import { IWorkflowCategory } from '@/type/workflow';
import { format } from 'date-fns';

export const getInitialWorkflow = (id: string) => ({
	id,
	name: 'New Workflow',
	category: IWorkflowCategory.Chatbot,
	lastModified: format(new Date(), 'yyyy-MM-dd hh:mm a'),
	data: {
		nodes: [],
		edges: [],
	},
});
