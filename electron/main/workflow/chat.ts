import { KnowledgeBases } from "./../../../src/constants/knowledge-base";
import { Nodelet } from "@/type/nodelet";
import { Conversation } from "./../../../src/type/conversation";
import { IWorkflow } from "@/type/workflow";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { TextLoader } from "langchain/document_loaders/fs/text";
import ollama from "ollama";
import _cloneDeep from "lodash/cloneDeep";
import {
  Document,
  MetadataMode,
  VectorStoreIndex,
  storageContextFromDefaults,
  OpenAIEmbedding,
  Settings,
  OpenAISession,
  SimpleNodeParser,
} from "llamaindex";
const httpsAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
import essay from "../../../examples/essay";
import { WorkspacePath, getEmbeddingModel } from "../knowledgeBase";
import { IKnowledgeBase } from "@/type/knowledgeBase";
import { getNodeInputObj } from "./utils";
import { InternalNodeletExecutor } from "./internal";
// import { executeOpenAI, executeOllama } from "./internal";

Settings.embedModel = new OpenAIEmbedding({
  model: "text-embedding-ada-002",
  session: new OpenAISession({ httpAgent: httpsAgent }),
});
Settings.nodeParser = new SimpleNodeParser({
  chunkSize: 100,
});
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
    await executeNode(currentNode, nodelets, conversation, context);

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
  const nodeInputsObj = getNodeInputObj(node, nodelet, conversation);
  const setNodeContext = (nodeId, nodeContext) => {
    conversation.nodeContext[nodeId] = nodeContext;
  };
  const setGlobalContext = (globalContext) =>
    (conversation.globalContext = globalContext);
  const executorContext = [
    node,
    nodeInputsObj,
    _cloneDeep(conversation.globalContext),
    setNodeContext,
    setGlobalContext,
  ];
  console.log(nodelet?.id);
  if (InternalNodeletExecutor[nodelet?.id]?.isAsync) {
    await InternalNodeletExecutor[nodelet?.id]?.executor(...executorContext);
  } else {
    InternalNodeletExecutor[nodelet?.id]?.executor(...executorContext);
  }
  // switch (nodelet?.id) {
  //   case "user-input": {
  //     console.log(
  //       `executing node ${node.id}, current message: ${conversation.globalContext?.currentMessage}`
  //     );
  //     conversation.nodeContext[node.id] = {
  //       outputs: { query: conversation.globalContext?.currentMessage },
  //     };
  //     conversation.globalContext.messages.push(
  //       conversation.globalContext?.currentMessage
  //     );
  //     break;
  //   }
  //   case "OpenAI": {
  //     await executeOpenAI(
  //       node,
  //       nodeInputsObj,
  //       _cloneDeep(conversation.globalContext),
  //       setNodeContext
  //     );
  //     break;
  //   }
  //   case "ollama": {
  //     await executeOllama(
  //       node,
  //       nodeInputsObj,
  //       _cloneDeep(conversation.globalContext),
  //       setNodeContext
  //     );

  //     // console.log(`executing node ollama ${node.id}`);
  //     // const { context = [], query = "" } = nodeInputsObj;
  //     // const response = await ollama.chat({
  //     //   model: "llama2",
  //     //   messages: [
  //     //     { role: "user", content: getContextPrompt(context.join(""), query) },
  //     //   ],
  //     // });
  //     // console.log(response.message.content);
  //     // conversation.nodeContext[node.id] = {
  //     //   outputs: { answer: response.message.content },
  //     // };
  //     break;
  //   }
  //   case "knowledgeBase": {
  //     console.log(`executing node knowledgeBase ${node.id}`);
  //     const {
  //       sourceHandle,
  //       targetHandle,
  //       id: sourceId,
  //     } = node.sourceNodes.find((n) => n.targetHandle === "query");
  //     console.log(node);
  //     const knowledgeBaseId = node?.data?.attr?.knowledgeBase?.value;
  //     const { knowledgeBases } = context;
  //     const knowledgeBase = knowledgeBases.find(
  //       (kb: IKnowledgeBase) => kb.id === knowledgeBaseId
  //     );
  //     const query = conversation.nodeContext[sourceId].outputs[sourceHandle];
  //     const embeddingModel = getEmbeddingModel(knowledgeBase?.model);
  //     const loadedVectorStore = await HNSWLib.load(
  //       `${WorkspacePath}/${knowledgeBase.id}/embeddings`,
  //       // new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent } })
  //       embeddingModel
  //     );

  //     const result = await loadedVectorStore.similaritySearch(query, 3);
  //     console.log(result);
  //     conversation.nodeContext[node.id] = {
  //       outputs: { ["RelativeContent"]: result.map((r) => r.pageContent) },
  //     };
  //     break;
  //   }
  //   case "ChatOutput": {
  //     const { sourceHandle, targetHandle, id: sourceId } = node.sourceNodes[0]; // todo
  //     const { output } = nodeInputsObj;
  //     // const res = conversation.nodeContext[sourceId].outputs[sourceHandle];
  //     conversation.globalContext.latestMessage = output;
  //     conversation.globalContext.messages.push(output);
  //   }
  // }
}
