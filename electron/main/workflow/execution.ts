import { InternalNodelets } from '@/constants/nodelets';
import { IDAGNode } from '@/type/dag';
import { IIntegration } from '@/type/integration';
import { ISettings } from '@/type/misc';
import { INodelet } from '@/type/nodelet';
import { IWorkflow } from '@/type/workflow';
import _cloneDeep from 'lodash/cloneDeep';
import { curry } from 'ramda';
import { Edge, Node, ReactFlowJsonObject } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { IConversation, IExecution } from '../../../src/type/conversation';
import { IKnowledgeBase } from '../../../src/type/knowledgeBase';
import ExecutionError from '../error/ExecutionError';
import { InternalNodeletExecutor } from './node-executors';
import { executeCustom } from './node-executors/custom';
import { getNodeInputObj } from './utils';
interface IContext {
	knowledgeBases: IKnowledgeBase[];
	integrations: IIntegration[];
	settings: ISettings;
}
const getNewExecution = (workflowId: string) => ({
	executionId: uuidv4(),
	workflowId,
	createDate: new Date().toLocaleString(),
	updateDate: new Date().toLocaleString(),
	nodeContext: {},
	globalContext: { variables: {}, errors: [] },
});
const getNewConversationExecution = (workflowId: string, message: string) => ({
	executionId: uuidv4(),
	workflowId,
	createDate: new Date().toLocaleString(),
	updateDate: new Date().toLocaleString(),
	nodeContext: {},
	globalContext: { userInput: message, variables: {} },
});
const getInitialConversation = (sessionId: string, workflowId: string, message: string): IConversation => ({
	sessionId,
	workflowId,
	name: 'new conversation',
	executions: [getNewConversationExecution(workflowId, message)],
	conversationContext: {
		messages: [message],
		currentMessage: message,
	},
});
export const newConversation = async (workflowId: string, message: string, db: any) => {
	const {
		conversations,
	}: {
		conversations: IConversation[];
	} = db.data;
	const conversation = getInitialConversation(`${workflowId}-${uuidv4()}`, workflowId, message);
	conversations.push(conversation);
	db.data.conversations = conversations;
	await db.write();
	return conversation;
};
export const chat = async (sessionId: string, workflowId: string, message: string, workflow: IWorkflow, db: any) => {
	await db.read();
	const {
		workflows,
		nodelets,
		conversations,
		integrations,
		knowledgeBases,
		settings,
	}: {
		workflows: IWorkflow[];
		nodelets: INodelet[];
		knowledgeBases: IKnowledgeBase[];
		conversations: IConversation[];
		integrations: IIntegration[];
		settings: ISettings;
	} = db.data;
	const currentWorkflow = workflow ?? workflows.find((w) => w.id === workflowId);
	if (!currentWorkflow) return;
	let conversation = conversations.find((c) => c.sessionId === sessionId);
	if (!conversation) {
		conversation = getInitialConversation(sessionId, workflowId, message);
		conversations.push(conversation);
	} else {
		conversation.conversationContext.currentMessage = message;
		conversation.conversationContext.messages.push(message);
		conversation.executions.push(getNewConversationExecution(workflowId, message));
	}
	const { nodes = [] } = currentWorkflow?.data || {};
	if (!nodes.length) return;
	const currentExecution = conversation.executions[conversation.executions.length - 1];
	//@ts-ignore
	await executeDAG(currentWorkflow.data, nodelets, integrations, currentExecution, {
		knowledgeBases,
		integrations,
		settings,
	});
	conversation.conversationContext.messages.push(currentExecution.globalContext.outputMessage);
	db.data.conversations = conversations;
	await db.write();
	return conversation;
};

function createNodeMap(nodes: Node[]) {
	const nodeMap = new Map<string, IDAGNode>();
	nodes.forEach((node) => {
		nodeMap.set(node.id, {
			...node,
			nextNodes: [],
			sourceNodes: [],
		});
	});
	return nodeMap;
}
export const runAutomation = async (workflowId: string, inputs: any, workflow: IWorkflow, db: any) => {
	await db.read();
	const {
		workflows,
		nodelets,
		integrations,
		knowledgeBases,
		settings,
		executions,
	}: {
		workflows: IWorkflow[];
		nodelets: INodelet[];
		knowledgeBases: IKnowledgeBase[];
		integrations: IIntegration[];
		settings: ISettings;
		executions: IExecution[];
	} = db.data;
	const currentWorkflow = workflow ?? workflows.find((w) => w.id === workflowId);
	const { nodes = [] } = _cloneDeep(currentWorkflow?.data || { nodes: [] });
	if (!nodes.length) return;
	const currentExecution = getNewExecution(workflowId) as IExecution;
	if (inputs) {
		// currentExecution.nodeContext = inputs;
		Object.keys(inputs).forEach((nodeId) => {
			const node = nodes.find((n) => n.id === nodeId);
			node.data.config = { ...node.data.config, ...inputs[nodeId] };
		});
	}
	try {
		//@ts-ignore
		await executeDAG({ ...currentWorkflow?.data, nodes }, nodelets, integrations, currentExecution, {
			knowledgeBases,
			integrations,
			settings,
		});
	} catch (e) {
		console.log(e);
	}
	executions.push(currentExecution);
	await db.write();
	return currentExecution;
};
function linkNodes(nodeMap: Map<string, IDAGNode>, edges: Edge[]) {
	edges.forEach((edge) => {
		const sourceNode = nodeMap.get(edge.source);
		const targetNode = nodeMap.get(edge.target);
		if (sourceNode && targetNode) {
			sourceNode.nextNodes.push(targetNode);
			targetNode.sourceNodes.push({
				...sourceNode,
				sourceHandle: edge.sourceHandle,
				targetHandle: edge.targetHandle,
			});
		}
	});
}

async function executeDAG(
	dagData: ReactFlowJsonObject,
	nodelets: INodelet[],
	integrations: IIntegration[],
	execution: IExecution,
	context: IContext,
) {
	console.log('execute dag');
	const nodeMap = createNodeMap(dagData.nodes);
	linkNodes(nodeMap, dagData.edges);
	const inDegrees = new Map(Array.from(nodeMap.values()).map((node) => [node.id, 0]));
	dagData.edges.forEach((edge) => {
		inDegrees.set(edge.target, inDegrees.get(edge.target)! + 1);
	});
	const queue = Array.from(inDegrees.entries())
		.filter(([_, degree]) => degree === 0)
		.map(([id]) => nodeMap.get(id)) as IDAGNode[];

	while (queue.length > 0) {
		const currentNode = queue.shift()!;
		try {
			await executeNode(currentNode, nodelets, integrations, execution, context);
		} catch (e) {
			if (e instanceof ExecutionError) {
				console.log('error');
				// execution.globalContext = { ...execution.globalContext, error: { id: e.id, message: e.message } };
				execution.globalContext.errors.push({ id: e.id, message: e.message, nodeName: currentNode.data.label });
				// break;
			} else {
				console.log(e);
			}
		}

		currentNode.nextNodes.forEach((nextNode: IDAGNode) => {
			const inDegree = inDegrees.get(nextNode.id)! - 1;
			inDegrees.set(nextNode.id, inDegree);
			if (inDegree === 0) {
				queue.push(nextNode);
			}
		});
	}
}

async function executeNode(node: IDAGNode, nodelets: INodelet[], integrations: IIntegration[], execution: IExecution, context: IContext) {
	const nodelet = nodelets.find((nl) => nl.id === node.data.nodeletId)!;
	const integration = integrations.find((integration) => integration.id === nodelet.id);
	const nodeInputs = getNodeInputObj(node, nodelet, execution);
	const setNodeContext = curry((nodeId: string, nodeContext: any) => {
		execution.nodeContext[nodeId] = nodeContext;
	})(node.id);
	const setGlobalContext = (globalContext: any) => (execution.globalContext = globalContext);
	const executorContext = {
		node,
		nodelet,
		nodeConfig: _cloneDeep(node.data?.config),
		nodeInputs,
		nodeContext: _cloneDeep(execution.nodeContext[node.id] || {}),
		integrationConfig: integration?.config || {},
		globalContext: _cloneDeep(execution.globalContext),
		setNodeContext,
		setGlobalContext,
		context,
	};
	if (nodelet.internal) {
		if (InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.isAsync) {
			await InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.executor(executorContext);
		} else {
			InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.executor(executorContext);
		}
	} else {
		executeCustom(executorContext);
	}
	postProcess(node, nodelet, execution, context);
}

function postProcess(node: IDAGNode, nodelet: INodelet, execution: IExecution, context: IContext) {
	const { variables = {} } = node.data.config;
	nodelet.outputs.forEach((output) => {
		if (variables[output.id]) {
			execution.globalContext.variables[variables[output.id]] = execution.nodeContext[node.id].outputs[output.id];
		}
	});
}
