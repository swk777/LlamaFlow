import { InternalNodelets } from "@/constants/nodelets";

import { executeOpenAI } from "./openAI";
import { executeOllama } from "./ollama";
import { executeUserInput } from "./user-input";
import { executeChatResponse } from "./chat-response";

export const InternalNodeletExecutor = {
  [InternalNodelets.UserInput]: { isAsync: false, executor: executeUserInput },
  [InternalNodelets.OpenAI]: { isAsync: true, executor: executeOpenAI },
  [InternalNodelets.Ollama]: { isAsync: true, executor: executeOllama },
  [InternalNodelets.ChatResponse]: {
    isAsync: false,
    executor: executeChatResponse,
  },
};
