import { IKnowledgeBase } from '@/type/knowledgeBase';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { getEmbeddingModel } from '../../knowledgeBase';
import { NodeletExecuteContext } from '../type';

export async function executeKnowledgeBase({ nodeConfig, nodeInputs, setNodeContext, context }: NodeletExecuteContext) {
	const { query = '' } = nodeInputs as { query: string };
	const { knowledgeBase: knowledgeBaseConfig } = nodeConfig;
	const { knowledgeBases, integrations } = context;

	const knowledgeBase = knowledgeBases.find((kb: IKnowledgeBase) => kb.id === knowledgeBaseConfig?.id);
	const embeddingModel = getEmbeddingModel(knowledgeBase?.model, integrations);
	const loadedVectorStore = await HNSWLib.load(`${globalThis.workspacePath}/${knowledgeBase.id}/embeddings`, embeddingModel);

	const result = await loadedVectorStore.similaritySearch(query, 3);
	setNodeContext &&
		setNodeContext({
			outputs: { ['RelativeContent']: result.map((r) => r.pageContent) },
		});
}
