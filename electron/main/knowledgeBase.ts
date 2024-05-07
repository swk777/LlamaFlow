import { KnowledgeBases } from "../../src/constants/knowledgeBase";
import { IKnowledgeBase } from "@/type/knowledgeBase";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "node:path";
import {
  OllamaEmbeddingModels,
  OpenAIEmbeddingModels,
} from "@/constants/models";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpsAgent = new HttpsProxyAgent("http://127.0.0.1:7890");

export const WorkspacePath =
  "/Users/larryyu/Documents/visionflow/knowledge-bases";
export const createKnowledgeBase = async (db, newKnowledgeBase) => {
  const knowledgeBase: IKnowledgeBase = {
    id: uuidv4(),
    name: newKnowledgeBase.name || "New Knowledge Base",
    description: newKnowledgeBase.description || "",
    workspaceId: "1",
    fileList: newKnowledgeBase.files || [],
    model: newKnowledgeBase.model,
  };
  db.data.knowledgeBases.push(knowledgeBase);

  try {
    fs.mkdirSync(`${WorkspacePath}/${knowledgeBase.id}`);
    fs.mkdirSync(`${WorkspacePath}/${knowledgeBase.id}/files`);
    fs.mkdirSync(`${WorkspacePath}/${knowledgeBase.id}/embeddings`);
    fs.mkdirSync(`${WorkspacePath}/${knowledgeBase.id}/temp`);
    console.log("Folder created successfully!");
  } catch (err) {
    console.error("Failed to create folder:", err);
  }
  copyFiles(newKnowledgeBase.files, knowledgeBase.id);
  const loader = new DirectoryLoader(
    `${WorkspacePath}/${knowledgeBase.id}/files`,
    {
      ".json": (path) => new JSONLoader(path, "/texts"),
      ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
      ".txt": (path) => new TextLoader(path),
      ".csv": (path) => new CSVLoader(path, "text"),
      ".pdf": (path) => new PDFLoader(path),
    }
  );
  const docs = await loader.loadAndSplit();
  // Load the docs into the vector store
  const vectorStore = await HNSWLib.fromDocuments(
    docs,
    // new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent } })
    getEmbeddingModel(newKnowledgeBase.model)
  );
  await vectorStore.save(`${WorkspacePath}/${knowledgeBase.id}/embeddings`);
  return knowledgeBase;
};

export async function addDocuments(files, id, db) {
  copyFiles(files, id, "temp");
  const knowledgeBaseIndex = db.data.knowledgeBases.findIndex(
    (k) => k.id === id
  );

  await db.update(({ knowledgeBases }) => {
    knowledgeBases[knowledgeBaseIndex].fileList =
      knowledgeBases[knowledgeBaseIndex].fileList.concat(files);
  });
  const loader = new DirectoryLoader(`${WorkspacePath}/${id}/temp`, {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
    ".pdf": (path) => new PDFLoader(path),
  });
  const docs = await loader.loadAndSplit();
  console.log(db.data.knowledgeBases[knowledgeBaseIndex].model);
  const loadedVectorStore = await HNSWLib.load(
    `${WorkspacePath}/${id}/embeddings`,
    // new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent } })
    getEmbeddingModel(db.data.knowledgeBases[knowledgeBaseIndex].model)
  );
  await loadedVectorStore.addDocuments(docs);
  await loadedVectorStore.save(`${WorkspacePath}/${id}/embeddings`);
  copyFiles(files, id, "embeddings");
  clearDirectorySync(`${WorkspacePath}/${id}/temp`);
}
function copyFiles(files: File[], id: string, name: string = "files") {
  try {
    files.forEach((file) => {
      fs.copyFileSync(file.path, `${WorkspacePath}/${id}/${name}/${file.name}`);
    });
    console.log("All files copied successfully!");
  } catch (error) {
    console.error("Failed to copy files:", error);
  }
}
function clearDirectorySync(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      // 只删除文件，忽略文件夹
      fs.unlinkSync(filePath);
    }
  }
}
export const getEmbeddingModel = (
  model: OllamaEmbeddingModels | OpenAIEmbeddingModels
) => {
  return Object.values(OllamaEmbeddingModels).includes(model)
    ? new OllamaEmbeddings({
        model: model, // default value
        baseUrl: "http://localhost:11434", // default value
      })
    : new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent }, model });
};
