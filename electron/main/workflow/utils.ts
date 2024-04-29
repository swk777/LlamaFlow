import { defineConfig } from "vite";
import { Nodelet } from "@/type/nodelet";

export const getNodeInputObj = (node, nodelet, conversation) => {
  const inputsObj = {};
  if ((nodelet?.inputs || []).length === 0) return {};

  nodelet?.inputs.forEach((input) => {
    const { sourceHandle, targetHandle, id } =
      node.sourceNodes.find((n) => n.targetHandle === input.id) || {}; // todo
    const sourceOutput = conversation.nodeContext[id]?.outputs[sourceHandle];
    if (sourceOutput) {
      inputsObj[input.id] = conversation.nodeContext[id]?.outputs[sourceHandle];
    }
  });
  return inputsObj;
};

export const getContextPrompt = (
  contextStr: string,
  queryStr: string
) => `Context information is below. \n
    --------------------- 
    ${contextStr} 
    \n---------------------\n 
    Given the context information and not prior knowledge, 
    answer the question: ${queryStr}\n`;
