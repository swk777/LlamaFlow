import { SentenceSplitter } from 'llamaindex';
import { NodeletExecuteContext } from '../type';
export async function executeSplitText({ globalContext, nodeInputs, setNodeContext }: NodeletExecuteContext) {
	console.log(`executing node current message: ${globalContext?.userInput}`);

	const { inputText } = nodeInputs;
	const sentenceSplitter = new SentenceSplitter({ chunkSize: 3000, chunkOverlap: 1 });
	const output = sentenceSplitter.getSentenceSplits(inputText);
	console.log(output);
	setNodeContext &&
		setNodeContext({
			outputs: { splitText: output },
		});
}
