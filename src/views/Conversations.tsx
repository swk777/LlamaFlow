import { AppContext } from '@/context/AppContext';
import { Button, Divider, Flex, Group, NavLink, Stack, Text } from '@mantine/core';
import { IconMessage2 } from '@tabler/icons-react';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

type Props = {};

export default function Conversations({}: Props) {
	const { conversations } = useContext(AppContext);
	const navigate = useNavigate();
	return (
		<Flex className="flex-1">
			<Flex direction={'column'} className="w-48 py-4">
				<div className="pt-3 pb-4">
					<Button
						size="sm"
						onClick={() => {
							navigate('/chat/new');
						}}
					>
						New Chat
					</Button>
				</div>
				<Divider />
				<Flex direction={'column'} className="pt-2 pb-4 px-2">
					{conversations.length === 0 ? (
						<Stack justify="center" align="center">
							<Text fw={500} className="text-gray-400 mt-8">
								No Conversations
							</Text>
						</Stack>
					) : (
						conversations
							.filter((conversation) => !conversation.sessionId.startsWith('temp'))
							.map((conversation) => {
								return (
									<>
										<Group gap={0}>
											<IconMessage2 className="w-4 h-4 mt-1" />
											<NavLink
												href="#required-for-focus"
												className="flex-1 "
												label="With icon"
												onClick={() => {
													navigate(`/chat/${conversation.sessionId}`);
												}}
											/>
										</Group>
										<Divider />
									</>
								);
							})
					)}
				</Flex>
			</Flex>
			<Divider orientation="vertical" />
			<Outlet />
		</Flex>
	);
}
