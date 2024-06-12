import { NodeletExecuteContext } from '../type';

import { shell } from 'electron';

export function executeEmail({ nodeInputs, nodeConfig }: NodeletExecuteContext) {
	const { mailContent } = nodeInputs as { mailContent: string };
	const email = nodeConfig.mailAddress; // 设置收件人邮箱
	const subject = encodeURIComponent(nodeConfig.mailHeader ?? '');
	const body = encodeURIComponent(mailContent);

	const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

	shell.openExternal(mailtoLink);
}
