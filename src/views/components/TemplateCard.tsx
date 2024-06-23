import { AppContext } from '@/context/AppContext';
import InternalNode from '@/node/InternalNode';
import { ITemplate } from '@/type/templates';
import { Button, Card, Flex, Modal, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFiles, IconPhoto } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import classes from '../KnowledgeCard.module.css';

type Props = {
	template: ITemplate;
};

export function TemplateCard({ template }: Props) {
	const [modalOpened, { open, close }] = useDisclosure(false);
	const { nodes = [], edges = [] } = template?.data;
	const [isAdding, setIsAdding] = useState(false);
	const { refreshWorkflows } = useContext(AppContext);

	const navigate = useNavigate();
	return (
		<>
			<Card withBorder padding="lg" className={classes.card} miw={250}>
				<Flex justify="left">
					<IconFiles className="text-primary mr-1" />
					<Tooltip label={template.name}>
						<Text fw={600} truncate>
							{template.name}
						</Text>
					</Tooltip>
				</Flex>
				<Text mt="sm" mb="xs" c="dimmed" fz="xs" className="text-left" ml="6">
					{template.description || '-'}
				</Text>
				<Card.Section className={classes.footer}>
					<Button leftSection={<IconPhoto size={14} />} variant="default" w={100} onClick={open}>
						View
					</Button>
					<Button
						leftSection={<IconPhoto size={14} />}
						w={100}
						loading={isAdding}
						onClick={() => {
							setIsAdding(true);
							const workflowId = uuidv4();
							window.ipcRenderer
								.addWorkflow({ ...template, lastModified: format(new Date(), 'yyyy-MM-dd hh:mm a'), id: workflowId })
								.then(async () => {
									await refreshWorkflows();
									setIsAdding(false);
									navigate(`/workflow-edit/${workflowId}?category=${template.category}`);
								});
						}}
					>
						Use
					</Button>
				</Card.Section>
			</Card>
			<Modal opened={modalOpened} size="xl" onClose={close} title="" centered>
				<div className="relative flex flex-1 reactflow-wrapper h-screen" style={{ height: '70vh' }}>
					<ReactFlow
						//@ts-ignore
						nodes={nodes.map((node) => {
							return {
								...node,
								type: 'internalNodelet',
							};
						})}
						edges={edges}
						className="absolute bottom-0 left-0 top-0 right-0"
						nodeTypes={{ internalNodelet: InternalNode }}
					>
						<MiniMap />
						<Controls />
						<Background />
					</ReactFlow>
				</div>
			</Modal>
		</>
	);
}
