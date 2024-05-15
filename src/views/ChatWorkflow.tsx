import { AppContext } from '@/context/AppContext';
import { IConversation } from '@/type/conversation';
import { IWorkflow } from '@/type/workflow';
import { Flex } from '@mantine/core';
import { useContext, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chat from './Chat';

type Props = {
	workflow?: IWorkflow;
	conversation?: IConversation;
};

export default function ChatWorkflow({ workflow, conversation }: Props) {
	const { refreshConversations, conversations } = useContext(AppContext);
	const id = useMemo(() => conversation?.sessionId ?? `temp-${workflow?.id}-${uuidv4()}`, []);
	const workflowConversation = conversation ?? conversations.find((c) => c.sessionId === id);

	const messages = useMemo(() => {
		return workflowConversation?.globalContext?.messages ?? [];
	}, [conversation, conversations]);
	useEffect(() => {
		window.ipcRenderer.getConversationById(id).then(() => {
			refreshConversations();
		});
	}, []);
	return (
		<Flex className="flex-1 overflow-x-hidden" direction="column">
			<Chat
				messages={messages}
				onSendMessage={(query) => {
					return window.ipcRenderer.chat(id, workflow?.id, query, workflow).then(() => {
						refreshConversations();
					});
				}}
			/>
		</Flex>
	);
}
