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
	const { refreshConversations } = useContext(AppContext);
	const messages = useMemo(() => {
		return conversation?.globalContext?.messages ?? [];
	}, [conversation]);
	console.log(workflow);
	const id = conversation?.sessionId ?? `temp-${workflow?.id}-${uuidv4()}`;
	useEffect(() => {
		window.ipcRenderer.getConversationById(id).then((res) => {
			refreshConversations();
		});
	}, []);
	return (
		<Flex className="flex-1 overflow-x-hidden" direction="column">
			<Chat
				messages={messages}
				onSendMessage={(query) => {
					window.ipcRenderer.chat(id, workflow?.id, query, workflow).then((res) => {
						console.log(res);
						refreshConversations();
						// setMessages(res);
					});
				}}
			/>
		</Flex>
	);
}
