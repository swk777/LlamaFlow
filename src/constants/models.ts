export enum OpenAIEmbeddingModels {
  "text-embedding-3-small" = "text-embedding-3-small",
  "text-embedding-ada-002" = "text-embedding-ada-002",
  "text-embedding-3-large" = "text-embedding-3-large",
}
export enum OllamaEmbeddingModels {
  "llama2" = "llama2",
}
export const EmbeddingModels = {
  OpenAI: Object.values(OpenAIEmbeddingModels).map((model) => ({
    value: model,
    label: `OpenAI/${model}`,
  })),
  Ollama: Object.values(OllamaEmbeddingModels).map((model) => ({
    value: model,
    label: `Ollama/${model}`,
  })),
};

export const EmbeddingModelsSelectOptions = Object.keys(EmbeddingModels).map(
  (model) => ({ group: model, items: EmbeddingModels[model] })
);
