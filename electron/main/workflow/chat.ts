import { Nodelet } from "@/type/nodelet";
import { Conversation } from "./../../../src/type/conversation";
import { IWorkflow } from "@/type/workflow";
import _cloneDeep from "lodash/cloneDeep";
import { IKnowledgeBase } from "@/type/knowledgeBase";
import { getNodeInputObj } from "./utils";
import { InternalNodeletExecutor } from "./internal";
import { v4 as uuidv4 } from "uuid";

const getInitialConversation = (
  sessionId: string,
  workflowId: string,
  message: string
): Conversation => ({
  sessionId,
  workflowId,
  createDate: new Date().toLocaleString(),
  updateDate: new Date().toLocaleString(),
  nodeContext: {},
  globalContext: { currentMessage: message, messages: [] },
});
export const newConversation = async (workflowId, message, db) => {
  const {
    conversations,
  }: {
    conversations: Conversation[];
  } = db.data;
  const conversation = getInitialConversation(
    `${workflowId}-${uuidv4()}`,
    workflowId,
    message
  );
  conversations.push(conversation);
  db.data.conversations = conversations;
  await db.write();
};
export const chat = async (
  sessionId: string,
  workflowId: string,
  message: string,
  workflow: IWorkflow,
  db: any
) => {
  await db.read();
  const {
    workflows,
    nodelets,
    conversations,
    integrations,
    knowledgeBases,
  }: {
    workflows: IWorkflow[];
    nodelets: Nodelet[];
    knowledgeBases: IKnowledgeBase[];
    conversations: Conversation[];
    integrations: any[];
  } = db.data;
  console.log(workflowId);
  const currentWorkflow =
    workflow ?? workflows.find((w) => w.id === workflowId);
  if (!currentWorkflow) return;
  let conversation = conversations.find((c) => c.sessionId === sessionId);
  if (!conversation) {
    conversation = getInitialConversation(sessionId, workflowId, message);
    conversations.push(conversation);
  } else {
    conversation.globalContext.currentMessage = message;
  }
  const { nodes = [], edges = [] } = currentWorkflow?.data || {};
  if (!nodes.length) return;
  await executeDAG(currentWorkflow.data, nodelets, integrations, conversation, {
    knowledgeBases,
  });
  db.data.conversations = conversations;
  await db.write();
  return conversation;
};

function createNodeMap(nodes) {
  const nodeMap = new Map();
  nodes.forEach((node) => {
    nodeMap.set(node.id, {
      ...node,
      nextNodes: [],
      sourceNodes: [],
    });
  });
  return nodeMap;
}

function linkNodes(nodeMap, edges) {
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
  dagData,
  nodelets,
  integrations,
  conversation,
  context
) {
  const nodeMap = createNodeMap(dagData.nodes);
  linkNodes(nodeMap, dagData.edges);
  const inDegrees = new Map(
    Array.from(nodeMap.values()).map((node) => [node.id, 0])
  );
  dagData.edges.forEach((edge) => {
    inDegrees.set(edge.target, inDegrees.get(edge.target) + 1);
  });
  const queue = Array.from(inDegrees.entries())
    .filter(([id, degree]) => degree === 0)
    .map(([id]) => nodeMap.get(id));

  while (queue.length > 0) {
    const currentNode = queue.shift();
    try {
      await executeNode(
        currentNode,
        nodelets,
        integrations,
        conversation,
        context
      );
    } catch (e) {
      console.log(e);
    }

    currentNode.nextNodes.forEach((nextNode) => {
      const inDegree = inDegrees.get(nextNode.id) - 1;
      inDegrees.set(nextNode.id, inDegree);
      if (inDegree === 0) {
        queue.push(nextNode);
      }
    });
  }
}

async function executeNode(
  node,
  nodelets,
  integrations,
  conversation: Conversation,
  context
) {
  const nodelet = nodelets.find((nl) => nl.id === node.data.nodeletId);
  const integration = integrations.find(
    (integration) => integration === nodelet.id
  );
  const nodeInputs = getNodeInputObj(node, nodelet, conversation);
  const setNodeContext = (nodeId, nodeContext) => {
    conversation.nodeContext[nodeId] = nodeContext;
  };
  const setGlobalContext = (globalContext) =>
    (conversation.globalContext = globalContext);
  const executorContext = {
    nodeId: node.id,
    nodeConfig: _cloneDeep(node.data?.config),
    nodeInputs,
    nodeContext: _cloneDeep(conversation.nodeContext[node.id] || {}),
    integrationConfig: integration?.config || {},
    globalContext: _cloneDeep(conversation.globalContext),
    setNodeContext,
    setGlobalContext,
  };
  if (InternalNodeletExecutor[nodelet?.id]?.isAsync) {
    await InternalNodeletExecutor[nodelet?.id]?.executor(executorContext);
  } else {
    InternalNodeletExecutor[nodelet?.id]?.executor(executorContext);
  }
}
