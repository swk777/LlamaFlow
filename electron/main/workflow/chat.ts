import { InternalNodelets } from '@/constants/nodelets';
import { IDAGNode } from '@/type/dag';
import { IIntegration } from '@/type/integration';
import { ISettings } from '@/type/misc';
import { Nodelet } from '@/type/nodelet';
import { IWorkflow } from '@/type/workflow';
import _cloneDeep from 'lodash/cloneDeep';
import { Edge, Node, ReactFlowJsonObject } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { IConversation } from './../../../src/type/conversation';
import { IKnowledgeBase } from './../../../src/type/knowledgeBase';
import { InternalNodeletExecutor } from './internal';
import { getNodeInputObj } from './utils';
interface IContext {
	knowledgeBases: IKnowledgeBase[];
	integrations: IIntegration[];
	settings: ISettings;
}
const getInitialConversation = (sessionId: string, workflowId: string, message: string): IConversation => ({
	sessionId,
	workflowId,
	createDate: new Date().toLocaleString(),
	updateDate: new Date().toLocaleString(),
	nodeContext: {},
	globalContext: { currentMessage: message, messages: [] },
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
		nodelets: Nodelet[];
		knowledgeBases: IKnowledgeBase[];
		conversations: IConversation[];
		integrations: IIntegration[];
		settings: ISettings;
	} = db.data;
	const currentWorkflow = workflow ?? workflows.find((w) => w.id === workflowId);
	console.log(currentWorkflow);
	if (!currentWorkflow) return;
	let conversation = conversations.find((c) => c.sessionId === sessionId);
	if (!conversation) {
		conversation = getInitialConversation(sessionId, workflowId, message);
		conversations.push(conversation);
	} else {
		conversation.globalContext.currentMessage = message;
	}
	const { nodes = [] } = currentWorkflow?.data || {};
	if (!nodes.length) return;
	await executeDAG(currentWorkflow.data, nodelets, integrations, conversation, {
		knowledgeBases,
		integrations,
		settings,
	});
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
	nodelets: Nodelet[],
	integrations: IIntegration[],
	conversation: IConversation,
	context: IContext,
) {
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
			await executeNode(currentNode, nodelets, integrations, conversation, context);
		} catch (e) {
			console.log(e);
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

async function executeNode(
	node: IDAGNode,
	nodelets: Nodelet[],
	integrations: IIntegration[],
	conversation: IConversation,
	context: IContext,
) {
	const nodelet = nodelets.find((nl) => nl.id === node.data.nodeletId)!;
	const integration = integrations.find((integration) => integration.id === nodelet.id);
	const nodeInputs = getNodeInputObj(node, nodelet, conversation);
	const setNodeContext = (nodeId: string, nodeContext: any) => {
		conversation.nodeContext[nodeId] = nodeContext;
	};
	const setGlobalContext = (globalContext: any) => (conversation.globalContext = globalContext);
	const executorContext = {
		nodeId: node.id,
		nodeConfig: _cloneDeep(node.data?.config),
		nodeInputs,
		nodeContext: _cloneDeep(conversation.nodeContext[node.id] || {}),
		integrationConfig: integration?.config || {},
		globalContext: _cloneDeep(conversation.globalContext),
		setNodeContext,
		setGlobalContext,
		context,
	};
	if (InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.isAsync) {
		await InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.executor(executorContext);
	} else {
		InternalNodeletExecutor[nodelet?.id as InternalNodelets]?.executor(executorContext);
	}
}
