import { InternalNodelets } from '@/constants/nodelets';

import { executeChatResponse } from './chat-response';
import { executeDeepSeek } from './deep-seek';
import { executeDisplayOnScreen } from './display-on-screen';
import { executeEmail } from './email';
import { executeFireCrawlLoader } from './firecrawl-loader';
import { executeKnowledgeBase } from './knowledge-base';
import { executeOllama } from './ollama';
import { executeOpenAI } from './openAI';
import { saveToFile } from './save-to-file';
import { executeSplitText } from './split-text';
import { executeTextInput } from './text-input';
import { executeTextAreaInput } from './textarea-input';
import { executeURLLoader } from './url-loader';
import { executeUserInput } from './user-input';
import { executeYoutubeLoader } from './youtube-loader';

export const InternalNodeletExecutor = {
	[InternalNodelets.UserInput]: { isAsync: false, executor: executeUserInput },
	[InternalNodelets.TextInput]: { isAsync: false, executor: executeTextInput },
	[InternalNodelets.TextAreaInput]: { isAsync: false, executor: executeTextAreaInput },
	[InternalNodelets.OpenAI]: { isAsync: true, executor: executeOpenAI },
	[InternalNodelets.Ollama]: { isAsync: true, executor: executeOllama },
	[InternalNodelets.KnowledgeBase]: { isAsync: true, executor: executeKnowledgeBase },
	[InternalNodelets.ChatResponse]: {
		isAsync: false,
		executor: executeChatResponse,
	},
	[InternalNodelets.SaveToFile]: { isAsync: true, executor: saveToFile },
	[InternalNodelets.DisplayOnScreen]: { isAsync: false, executor: executeDisplayOnScreen },
	[InternalNodelets.FireCrawl]: { isAsync: true, executor: executeFireCrawlLoader },
	[InternalNodelets.URLLoader]: { isAsync: true, executor: executeURLLoader },
	[InternalNodelets.YoutubeLoader]: { isAsync: true, executor: executeYoutubeLoader },
	[InternalNodelets.Email]: { isAsync: false, executor: executeEmail },
	[InternalNodelets.DeepSeek]: { isAsync: true, executor: executeDeepSeek },
	[InternalNodelets.SplitText]: { isAsync: false, executor: executeSplitText },
};
