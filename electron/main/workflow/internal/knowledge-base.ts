import { IKnowledgeBase } from '@/type/knowledgeBase';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { getEmbeddingModel } from '../../knowledgeBase';

export async function executeKnowledgeBase({ nodeId, nodeConfig, nodeInputs, setNodeContext, context }) {
	const { query = '' } = nodeInputs;
	const { knowledgeBase: knowledgeBaseConfig } = nodeConfig;
	const { knowledgeBases, integrations, settings } = context;

	const knowledgeBase = knowledgeBases.find((kb: IKnowledgeBase) => kb.id === knowledgeBaseConfig?.id);
	const embeddingModel = getEmbeddingModel(knowledgeBase?.model, integrations);
	const loadedVectorStore = await HNSWLib.load(`${globalThis.workspacePath}/${knowledgeBase.id}/embeddings`, embeddingModel);

	const result = await loadedVectorStore.similaritySearch(query, 3);
	setNodeContext(nodeId, {
		outputs: { ['RelativeContent']: result.map((r) => r.pageContent) },
	});
}
