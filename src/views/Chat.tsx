import { Button, Flex, Input, List, Paper, ThemeIcon, rem } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

type Props = { messages: string[]; onSendMessage: (message: string) => void };

export default function Chat({ messages, onSendMessage }: Props) {
	const [query, setQuery] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const endOfMessagesRef = useRef<HTMLDivElement>(null);
	const handleKeyDown = (event) => {
		// 检查是否是回车键
		if (event.key === 'Enter') {
			onSend();
		}
	};
	const onSend = () => {
		setIsFetching(true);
		onSendMessage(query)
			.then(() => {
				setQuery('');
				setIsFetching(false);
			})
			.catch(() => {
				setIsFetching(false);
			});
	};
	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
	});
	return (
		<Flex className="flex-1 overflow-y-hidden p-5" gap="md" direction="column" justify="center">
			<List spacing="lg" size="sm" className="flex-1 overflow-y-auto " classNames={{ item: 'text-left', itemWrapper: 'items-start' }}>
				{messages.map((message, index) => (
					<List.Item
						className="shadow-sm p-1"
						key={message + index}
						style={{ textAlignment: 'left' }}
						icon={
							<ThemeIcon color={index % 2 === 0 ? 'teal' : 'blue'} size={24} radius="xl">
								<IconUserCircle style={{ width: rem(16), height: rem(16) }} />
							</ThemeIcon>
						}
					>
						<Paper>{message} </Paper>
					</List.Item>
				))}
				{isFetching && (
					<List.Item
						key={query}
						style={{ textAlignment: 'left' }}
						icon={
							<ThemeIcon color="teal" size={24} radius="xl">
								<IconUserCircle style={{ width: rem(16), height: rem(16) }} />
							</ThemeIcon>
						}
					>
						<Paper>{query} </Paper>
					</List.Item>
				)}
			</List>
			<Input onKeyDown={handleKeyDown} disabled={isFetching} value={query} onChange={(e) => setQuery(e.target.value)} />
			<Button onClick={onSend} w="6rem" loading={isFetching} ref={endOfMessagesRef}>
				Send
			</Button>
		</Flex>
	);
}
