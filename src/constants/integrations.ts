import { ConfigurationType } from "@/node/config/configType";

export const Integrations = [
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
        placeholder: "http://localhost:11434",
        required: true,
      },
      {
        name: "model",
        fieldName: "model",
        label: "Model:",
        type: "TAGS",
        placeholder: "ollama model",
        required: true,
        model: {
          values: [
            { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
            { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
            { value: "gpt-4", label: "gpt-4" },
            { value: "gpt-4-32k", label: "gpt-4-32k" },
            { value: "gpt-4-turbo", label: "gpt-4-turbo" },
            { value: "gpt-4-turbo-preview", label: "gpt-4-turbo-preview" },
          ],
        },
      },
    ],
    config: {},
  },
];
