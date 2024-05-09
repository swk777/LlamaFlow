import { ConfigurationType } from "@/node/config/configType";
import { IIntegration } from "@/type/integration";

export const Integrations: IIntegration[] = [
  {
    id: "OpenAI",
    label: "OpenAI",
    configDefinitions: [
      {
        label: "API Key:",
        fieldName: "apiKey",
        type: ConfigurationType.INPUT,
        placeholder: "sk-xxxx",
        required: true,
      },
    ],
    config: {},
  },
  {
    id: "Ollama",
    label: "Ollama",
    configDefinitions: [
      {
        label: "Base URL:",
        fieldName: "baseUrl",
        type: ConfigurationType.INPUT,
        defaultValue: "http://localhost:11434",
        placeholder: "http://localhost:11434",
        required: true,
      },
      {
        name: "model",
        fieldName: "model",
        label: "Model:",
        type: "TAGS",
        placeholder: "ollama models",
        description: "press Enter to add",
        required: true,
      },
    ],
    config: {},
  },
];
