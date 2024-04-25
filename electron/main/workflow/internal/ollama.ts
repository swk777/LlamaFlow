import { HttpsProxyAgent } from "https-proxy-agent";
import ollama from "ollama";
import { getContextPrompt } from "../utils";

export async function executeOllama(
  node,
  nodeInputs,
  globalContext,
  setNodeContext
) {
  const { context = [], query = "" } = nodeInputs;
  // console.log(context);
  const response = await ollama.chat({
    model: "llama2",
    messages: [
      {
        role: "user",
        content: context.length
          ? getContextPrompt(context.join(""), query)
          : query,
      },
    ],
  });
  setNodeContext(node?.id, {
    outputs: { answer: response.message.content },
  });
}
