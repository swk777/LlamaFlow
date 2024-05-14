import { Button, Flex, Input, List, Paper, ThemeIcon, rem } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';

type Props = { messages: string[]; onSendMessage: (message: string) => void };

export default function Chat({ messages, onSendMessage }: Props) {
	const [query, setQuery] = useState('');
	console.log(messages);
	return (
		<Flex className=" flex-1  overflow-y-hidden p-5" gap="md" direction="column" justify="center">
			<List
				spacing="lg"
				size="sm"
				className="flex-1 overflow-y-auto "
				classNames={{ item: 'text-left', itemWrapper: 'items-start' }}
				icon={
					<ThemeIcon color="teal" size={24} radius="xl">
						<IconUserCircle style={{ width: rem(16), height: rem(16) }} />
					</ThemeIcon>
				}
			>
				{messages.map((message, index) => (
					<List.Item key={message + index} style={{ textAlignment: 'left' }}>
						<Paper>{message} </Paper>
					</List.Item>
				))}
			</List>
			<Input value={query} onChange={(e) => setQuery(e.target.value)} />
			<Button
				onClick={() => {
					onSendMessage(query);
					setQuery('');
				}}
				w="6rem"
			>
				Send
			</Button>
		</Flex>
	);
}
