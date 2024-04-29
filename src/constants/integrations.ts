import { ConfigurationType } from "@/node/cfg/cfg-type";

export const Integrations = [
  {
    id: "OpenAI",
    configDefinitions: [
      {
        label: "API Key:",
        fieldName: "apiKey",
        type: ConfigurationType.STRING,
        placeholder: "sk-xxxx",
        required: true,
      },
    ],
    config: {},
  },
  {
    id: "Ollama",
    configDefinitions: [
      {
        label: "Base URL:",
        fieldName: "baseUrl",
        type: ConfigurationType.STRING,
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
