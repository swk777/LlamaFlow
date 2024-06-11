import { YoutubeTranscript } from 'youtube-transcript';

import { NodeletExecuteContext } from '../type';
export async function executeYoutubeLoader({ setNodeContext, nodeConfig }: NodeletExecuteContext) {
	let transcript = '';
	try {
		transcript = (await YoutubeTranscript.fetchTranscript(nodeConfig.url)).map((t) => t.text).join('');
	} catch (e) {
		console.log(e);
	}
	console.log(transcript);
	setNodeContext &&
		setNodeContext({
			outputs: { transcript },
		});
}
