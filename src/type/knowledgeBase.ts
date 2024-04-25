import {
  OllamaEmbeddingModels,
  OpenAIEmbeddingModels,
} from "@/constants/models";

export interface IKnowledgeBase {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  fileList: File[];
  model: OllamaEmbeddingModels | OpenAIEmbeddingModels;
}
