import FirecrawlApp from '@mendable/firecrawl-js';
import { NodeletExecuteContext } from '../type';
export async function executeFireCrawlLoader({ setNodeContext, integrationConfig, nodeConfig }: NodeletExecuteContext) {
	const app = new FirecrawlApp({ apiKey: integrationConfig.apiKey });

	const url = nodeConfig.url;
	const scrapedData = await app.scrapeUrl(url);
	setNodeContext &&
		setNodeContext({
			outputs: { content: scrapedData.data.markdown },
		});
}
