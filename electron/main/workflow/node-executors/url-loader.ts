import * as cheerio from 'cheerio';
import { convert } from 'html-to-text';
import fetch from 'node-fetch';

import { NodeletExecuteContext } from '../type';
export async function executeURLLoader({ setNodeContext, nodeConfig }: NodeletExecuteContext) {
	let content = '';
	try {
		const response = await fetch(nodeConfig.url);
		const responseText = await response.text();
		const $ = cheerio.load(responseText);
		$('script').remove();
		const body = $('body').text();
		content = convert(body, { wordwrap: 130 });
	} catch (e) {
		console.log(e);
	}

	setNodeContext &&
		setNodeContext({
			outputs: { content },
		});
}
