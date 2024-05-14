import { OllamaEmbeddingModels, OpenAIEmbeddingModels } from '@/constants/models';
import { IIntegration } from '@/type/integration';
import { IKnowledgeBase } from '@/type/knowledgeBase';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

export const createKnowledgeBase = async (db, newKnowledgeBase) => {
	const knowledgeBase: IKnowledgeBase = {
		id: uuidv4(),
		name: newKnowledgeBase.name || 'New Knowledge Base',
		description: newKnowledgeBase.description || '',
		workspaceId: '1',
		fileList: newKnowledgeBase.files || [],
		model: newKnowledgeBase.model,
	};
	db.data.knowledgeBases.push(knowledgeBase);
	const workspacePath = globalThis.workspacePath;
	try {
		fs.mkdirSync(`${workspacePath}/${knowledgeBase.id}`);
		fs.mkdirSync(`${workspacePath}/${knowledgeBase.id}/files`);
		fs.mkdirSync(`${workspacePath}/${knowledgeBase.id}/embeddings`);
		fs.mkdirSync(`${workspacePath}/${knowledgeBase.id}/temp`);
		console.log('Folder created successfully!');
	} catch (err) {
		console.error('Failed to create folder:', err);
	}
	copyFiles(newKnowledgeBase.files, knowledgeBase.id, workspacePath);
	const loader = new DirectoryLoader(`${workspacePath}/${knowledgeBase.id}/files`, {
		'.json': (path) => new JSONLoader(path),
		'.txt': (path) => new TextLoader(path),
		'.csv': (path) => new CSVLoader(path),
		'.pdf': (path) => new PDFLoader(path),
		'.md': (path) => new TextLoader(path),
		'.docx': (path) => new DocxLoader(path),
		'.doc': (path) => new DocxLoader(path),
		'.pptx': (path) => new PPTXLoader(path),
		'.ppt': (path) => new PPTXLoader(path),
	});
	const docs = await loader.loadAndSplit();
	console.log(docs);
	// Load the docs into the vector store
	const vectorStore = await HNSWLib.fromDocuments(docs, getEmbeddingModel(newKnowledgeBase.model));
	await vectorStore.save(`${workspacePath}/${knowledgeBase.id}/embeddings`);
	return knowledgeBase;
};

export async function addDocuments(files, id, db) {
	copyFiles(files, id, globalThis.workspacePath, 'temp');
	const knowledgeBaseIndex = db.data.knowledgeBases.findIndex((k) => k.id === id);
	const workspacePath = globalThis.workspacePath;
	await db.update(({ knowledgeBases }) => {
		knowledgeBases[knowledgeBaseIndex].fileList = knowledgeBases[knowledgeBaseIndex].fileList.concat(files);
	});
	const loader = new DirectoryLoader(`${workspacePath}/${id}/temp`, {
		'.json': (path) => new JSONLoader(path),
		'.txt': (path) => new TextLoader(path),
		'.csv': (path) => new CSVLoader(path),
		'.pdf': (path) => new PDFLoader(path),
		'.md': (path) => new TextLoader(path),
		'.docx': (path) => new DocxLoader(path),
		'.doc': (path) => new DocxLoader(path),
		'.pptx': (path) => new PPTXLoader(path),
		'.ppt': (path) => new PPTXLoader(path),
	});
	const docs = await loader.loadAndSplit();
	console.log(db.data.knowledgeBases[knowledgeBaseIndex].model);
	const loadedVectorStore = await HNSWLib.load(
		`${workspacePath}/${id}/embeddings`,
		getEmbeddingModel(db.data.knowledgeBases[knowledgeBaseIndex].model),
	);
	console.log(loadedVectorStore);
	await loadedVectorStore.addDocuments(docs);
	await loadedVectorStore.save(`${workspacePath}/${id}/embeddings`);
	copyFiles(files, id, 'embeddings');
	clearDirectorySync(`${workspacePath}/${id}/temp`);
}
function copyFiles(files: File[], id: string, workspacePath: string, name: string = 'files') {
	try {
		files.forEach((file) => {
			fs.copyFileSync(file.path, `${workspacePath}/${id}/${name}/${file.name}`);
		});
		console.log('All files copied successfully!');
	} catch (error) {
		console.error('Failed to copy files:', error);
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
export const getEmbeddingModel = (model: OllamaEmbeddingModels | OpenAIEmbeddingModels, integrations: IIntegration) => {
	return Object.values(OllamaEmbeddingModels).includes(model)
		? new OllamaEmbeddings({
				model: model, // default value
				baseUrl: integrations?.Ollama?.baseUrl ?? 'http://localhost:11434', // default value
			})
		: new OpenAIEmbeddings({ configuration: { httpAgent: httpsAgent }, model, openAIApiKey: integrations?.OpenAI?.apiKey });
};
