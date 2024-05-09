import { AppContext } from '@/context/AppContext';
import { Button, Card, Flex, SimpleGrid, Text } from '@mantine/core';
import { IconGraph } from '@tabler/icons-react';
import { useContext } from 'react';

type Props = {};

export default function WorkflowGrid({}: Props) {
	const { workflows, refreshConversations } = useContext(AppContext);
	return (
		<SimpleGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={{ base: 10, sm: 'xl' }} className="px-8 py-8 auto-rows-min">
			{workflows.map((workflow) => (
				<Card shadow="sm" padding="md" radius="md" withBorder w={200} h={150}>
					<Flex justify="center">
						<IconGraph className="shrink-0 w-6 h-6" />
						<Text fw={500} className="truncate ml-3">
							{workflow.name}
						</Text>
						{/* <Badge color="pink">On Sale</Badge> */}
					</Flex>
					<Button
						color="blue"
						fullWidth
						mt="md"
						radius="md"
						onClick={() => {
							window.ipcRenderer.newConversation(workflow?.id).then((res) => {
								console.log(res);
								refreshConversations();
							});
						}}
					>
						Chat
					</Button>
				</Card>
			))}
		</SimpleGrid>
	);
}
