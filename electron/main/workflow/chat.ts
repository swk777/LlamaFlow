import { Nodelet } from "@/type/nodelet";
import { Conversation } from "./../../../src/type/conversation";
import { Workflow } from "@/type/workflow";
import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

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

const getContextPrompt = (
  contextStr: string,
  queryStr: string
) => `Context information is below. \n
  --------------------- 
  ${contextStr} 
  \n---------------------\n 
  Given the context information and not prior knowledge, 
  answer the question: ${queryStr}\n`;
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
  db: any
) => {
  await db.read();
  const {
    workflows,
    nodelets,
    conversations,
  }: {
    workflows: Workflow[];
    nodelets: Nodelet[];
    conversations: { [sessionId: string]: Conversation };
  } = db.data;
  const workflow = workflows.find((w) => w.id === workflowId);
  if (!workflow) return;
  if (!conversations[sessionId]) {
    conversations[sessionId] = getInitialConversation(sessionId, message);
  } else {
    conversations[sessionId].globalContext.currentMessage = message;
  }
  const { nodes = [], edges = [] } = workflow?.data || {};
  if (!nodes.length) return;
  await executeDAG(workflow.data, nodelets, conversations[sessionId]);
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

async function executeDAG(dagData, nodelets, conversation) {
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
    await executeNode(currentNode, nodelets, conversation);

    currentNode.nextNodes.forEach((nextNode) => {
      const inDegree = inDegrees.get(nextNode.id) - 1;
      inDegrees.set(nextNode.id, inDegree);
      if (inDegree === 0) {
        queue.push(nextNode);
      }
    });
  }
}

async function executeNode(node, nodelets, conversation: Conversation) {
  const nodelet = nodelets.find((nl) => nl.id === node.data.nodeletId);
  switch (nodelet?.id) {
    case "input1": {
      console.log(
        `executing node ${node.id}, current message: ${conversation.globalContext?.currentMessage}`
      );
      conversation.nodeContext[node.id] = {
        outputs: { output: conversation.globalContext?.currentMessage },
      };
      conversation.globalContext.messages.push(
        conversation.globalContext?.currentMessage
      );
      break;
    }
    case "openai": {
      console.log(`executing node openai ${node.id}`);
      const {
        sourceHandle: qsourceHandle,
        targetHandle: qtargetHandle,
        id: qsourceId,
      } = node.sourceNodes[0]; // todo
      const {
        sourceHandle: ksourceHandle,
        targetHandle: ktargetHandle,
        id: ksourceId,
      } = node.sourceNodes[1]; // todo
      const query = conversation.nodeContext[qsourceId].outputs[qsourceHandle];
      console.log(query);
      // console.log(node.sourceNodes);
      const context =
        conversation.nodeContext[ksourceId].outputs[ksourceHandle];
      // console.log(context);
      const openai = new OpenAI({
        apiKey: "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", // This is the default and can be omitted
        // baseURL: "https://api.smartdeck.ai/proxy",
        httpAgent: httpsAgent,
      });
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: "user", content: getContextPrompt(context.join(""), query) },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(chatCompletion.choices[0].message.content);
      const result =
        "I am a language model and do not have real-time capabilities. Please check the date on your device for the current date.";
      conversation.nodeContext[node.id] = {
        outputs: { o1: chatCompletion.choices[0].message.content },
      };
      break;
    }
    case "knowledgeBase": {
      console.log(`executing node knowledgeBase ${node.id}`);
      // const loader = new TextLoader(
      //   "/Users/larryyu/Documents/workspace/electron/VisionFlow/examples/essay.txt"
      // );
      // const docs = await loader.loadAndSplit();

      // // Load the docs into the vector store
      // const vectorStore = await HNSWLib.fromDocuments(
      //   docs,
      //   new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent } })
      // );
      // await vectorStore.save(
      //   "/Users/larryyu/Documents/workspace/electron/VisionFlow/examples"
      // );
      const { sourceHandle, targetHandle, id: sourceId } = node.sourceNodes[0];
      const query = conversation.nodeContext[sourceId].outputs[sourceHandle];
      const loadedVectorStore = await HNSWLib.load(
        "/Users/larryyu/Documents/workspace/electron/VisionFlow/examples/",
        new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent } })
      );

      // vectorStore and loadedVectorStore are identical

      const result = await loadedVectorStore.similaritySearch(query, 3);
      console.log(result);
      conversation.nodeContext[node.id] = {
        outputs: { context: result.map((r) => r.pageContent) },
      };
      // const document = new Document({ text: essay, id_: "essay" });

      // const storageContext = await storageContextFromDefaults({
      //   persistDir:
      //     "/Users/larryyu/Documents/workspace/electron/VisionFlow/examples",
      // });
      // const index = await VectorStoreIndex.fromDocuments([document], {
      //   storageContext,
      // });
      // const secondStorageContext = await storageContextFromDefaults({
      //   persistDir:
      //     "/Users/larryyu/Documents/workspace/electron/VisionFlow/examples",
      // });
      // const loadedIndex = await VectorStoreIndex.init({
      //   storageContext: secondStorageContext,
      // });
      // const retriever = loadedIndex.asRetriever();
      // retriever.similarityTopK = 3;
      // const nodes = await retriever.retrieve({
      //   query: "What did the author do growing up?",
      // });
      // console.log(nodes.map((n) => n.node.getContent(MetadataMode.NONE)));

      // const loadedQueryEngine = loadedIndex.asQueryEngine();
      // const loadedQueryEngine = loadedIndex.asQueryEngine();
      // const loadedResponse = await loadedQueryEngine.query({
      //   query: "What did the author do growing up?",
      // });
      // console.log(loadedResponse.toString());
      break;
    }
    case "ChatOutput": {
      const { sourceHandle, targetHandle, id: sourceId } = node.sourceNodes[0]; // todo
      console.log(sourceId);
      const res = conversation.nodeContext[sourceId].outputs[sourceHandle];
      conversation.globalContext.currentResult = res;
      conversation.globalContext.messages.push(res);
    }
  }
  // 根据node.data.attr.category等属性实现具体逻辑
}
