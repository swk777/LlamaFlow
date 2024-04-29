import { Nodelet } from "@/type/nodelet";
import { Conversation } from "./../../../src/type/conversation";
import { IWorkflow } from "@/type/workflow";
import _cloneDeep from "lodash/cloneDeep";
import { IKnowledgeBase } from "@/type/knowledgeBase";
import { getNodeInputObj } from "./utils";
import { InternalNodeletExecutor } from "./internal";

const getInitialConversation = (
  sessionId: string,
  message: string
): Conversation => ({
  sessionId,
  createDate: new Date().toLocaleString(),
  updateDate: new Date().toLocaleString(),
  nodeContext: {},
  globalContext: { currentMessage: message, messages: [] },
});
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
    knowledgeBases,
  }: {
    workflows: IWorkflow[];
    nodelets: Nodelet[];
    knowledgeBases: IKnowledgeBase[];
    conversations: { [sessionId: string]: Conversation };
  } = db.data;
  const currentWorkflow =
    workflow ?? workflows.find((w) => w.id === workflowId);
  if (!currentWorkflow) return;
  if (!conversations[sessionId]) {
    conversations[sessionId] = getInitialConversation(sessionId, message);
  } else {
    conversations[sessionId].globalContext.currentMessage = message;
  }
  const { nodes = [], edges = [] } = currentWorkflow?.data || {};
  if (!nodes.length) return;
  await executeDAG(currentWorkflow.data, nodelets, conversations[sessionId], {
    knowledgeBases,
  });
  await db.write();
  return conversations[sessionId];
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

async function executeDAG(dagData, nodelets, conversation, context) {
  const nodeMap = createNodeMap(dagData.nodes);
  linkNodes(nodeMap, dagData.edges);
  //   console.log(nodeMap);
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
      await executeNode(currentNode, nodelets, conversation, context);
    } catch (e) {
      console.log(e)
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
  conversation: Conversation,
  context
) {
  const nodelet = nodelets.find((nl) => nl.id === node.data.nodeletId);
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
