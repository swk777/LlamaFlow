import { HttpsProxyAgent } from "https-proxy-agent";
import OpenAI from "openai";
import { getContextPrompt } from "../utils";

const httpsAgent = new HttpsProxyAgent("http://127.0.0.1:7890");

export async function executeOpenAI(
  node,
  nodeInputs,
  globalContext,
  setNodeContext
) {
  const { context = [], query = "" } = nodeInputs;
  const openai = new OpenAI({
    apiKey: "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", // This is the default and can be omitted
    httpAgent: httpsAgent,
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: context.length
          ? getContextPrompt(context.join(""), query)
          : query,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(chatCompletion.choices[0].message.content);
  setNodeContext(node?.id, {
    outputs: { answer: chatCompletion.choices[0].message.content },
  });
}
