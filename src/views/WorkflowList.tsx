import { useContext, useRef } from 'react';

import { AppContext } from '@/context/AppContext';
import { Badge, Container, Flex, Modal, Stack, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArticle, IconPencil, IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import RunAutomation from './RunAutomation';

type Props = {};

export default function WorkflowList({}: Props) {
	const { workflows = [] } = useContext(AppContext);
	const navigate = useNavigate();
	const [inputsModalOpened, { open, close }] = useDisclosure(false);
	const currentWorkflowId = useRef('');
	return workflows.length === 0 ? (
		<Container>
			<Stack justify="center" align="center">
				<IconArticle className="text-gray-600 w-8 h-8" />
				<Text fw={500} className="text-gray-400">
					No Workflows
				</Text>
			</Stack>
		</Container>
	) : (
		<>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th className="hidden w-[100px] sm:table-cell">
							<span className="sr-only">Image</span>
						</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th className="text-center">Category</Table.Th>
						<Table.Th className="hidden md:table-cell text-center">Last modified</Table.Th>
						<Table.Th>
							<span className="sr-only">Actions</span>
						</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{(workflows || []).map(({ id, name, category, lastModified }, idx) => (
						<Table.Tr key={id + name}>
							<Table.Td className="font-medium hidden sm:table-cell w-1/15" height={50}>
								{idx + 1}.
							</Table.Td>
							<Table.Td className="font-medium w-1/3 text-left">{name}</Table.Td>
							<Table.Td>
								<Badge variant="outline">{category}</Badge>
							</Table.Td>
							<Table.Td className="hidden md:table-cell">{lastModified}</Table.Td>
							<Table.Td>
								<Flex className="flex-row" gap="md">
									<IconPlayerPlay
										size={16}
										className="text-primary cursor-pointer"
										onClick={async () => {
											if (category === 'Chatbot') {
												const conversation = await window.ipcRenderer.newConversation(id);
												navigate(`/chat/${conversation?.sessionId}`);
											} else {
												currentWorkflowId.current = id;
												open();
											}
										}}
									/>
									<IconPencil
										size={16}
										onClick={() => {
											navigate(`/workflow-edit/${id}`);
										}}
										className="text-primary cursor-pointer"
									/>
								</Flex>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
			<Modal opened={inputsModalOpened} size="lg" onClose={close} title="Run Automation">
				<RunAutomation workflow={workflows.find((w) => w.id === currentWorkflowId.current)} />
			</Modal>
		</>
	);
}
