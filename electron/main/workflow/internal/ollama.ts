import { HttpsProxyAgent } from "https-proxy-agent";
import ollama from "ollama";
import { getContextPrompt } from "../utils";

export async function executeOllama({ nodeId, nodeInputs, setNodeContext }) {
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
  setNodeContext(nodeId, {
    outputs: { answer: response.message.content },
  });
}
