import { INodelet } from '@/type/nodelet';
import { IWorkflowCategory } from '@/type/workflow';
import { WorkflowCategory } from './../type/nodelet';

export function getNodeletsByCategory(nodelets: INodelet[], category: IWorkflowCategory) {
	switch (category) {
		case IWorkflowCategory.Automation:
			return nodelets.filter((nodelet) => [WorkflowCategory.Automation, WorkflowCategory.All].includes(nodelet.workflowCategory));
		case IWorkflowCategory.Chatbot:
			return nodelets.filter((nodelet) => [WorkflowCategory.Chatbot, WorkflowCategory.All].includes(nodelet.workflowCategory));
		default:
			return nodelets;
	}
}
