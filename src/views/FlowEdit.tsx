import Configuration from '@/node/config/Configuration';
import { IconBrandHipchat, IconCheck, IconDeviceFloppy, IconPencil, IconPlayerPlay } from '@tabler/icons-react';
import { MouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ReactFlow, {
	Background,
	Connection,
	Controls,
	Edge,
	MiniMap,
	Node,
	ReactFlowInstance,
	addEdge,
	useEdgesState,
	useNodesState,
} from 'reactflow';

import { getInitialWorkflow } from '@/constants/workflow';
import { AppContext } from '@/context/AppContext';
import InternalNode from '@/node/InternalNode';
import { IWorkflow, IWorkflowCategory } from '@/type/workflow';
import { buildDefaultConfig } from '@/utils/utils';
import { getNodeletsByCategory } from '@/utils/workflow';
import { Button, Divider, Drawer, Flex, FocusTrap, Group, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useParams, useSearchParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import ChatWorkflow from './ChatWorkflow';
import Nodelet from './Nodelet';
import RunAutomation from './RunAutomation';

const nodeTypes = { internalNodelet: InternalNode };

function FlowEdit() {
	const { workflowId = '' } = useParams();
	let [searchParams] = useSearchParams();
	const [configOpened, setConfigOpened] = useState(false);
	const [chatOpened, setChatOpened] = useState(false);
	const [inputsModalOpened, { open, close }] = useDisclosure(false);

	const { nodelets, workflows, updateWorkflow, integrations, refreshWorkflows } = useContext(AppContext);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
	const reactFlowWrapper = useRef(null);
	const workflow = workflows.find((w) => w.id === workflowId) || getInitialWorkflow(workflowId);
	const category = (searchParams.get('category') ?? workflow.category) as IWorkflowCategory;
	const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.data?.nodes || []);
	const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.data?.edges || []);
	const [selectedNode, setSelectedNode] = useState<Node>();
	const [isEditingName, setIsEditingName] = useState(false);
	const [workflowName, setWorkflowName] = useState(workflow?.name);
	const integration = integrations.find((intgn) => intgn.id === selectedNode?.data.nodeletId);
	const workflowNodelets = useMemo(() => getNodeletsByCategory(nodelets, category), [nodelets, category]);

	const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			event.preventDefault();
			const nodeletId = event.dataTransfer.getData('application/reactflow');
			if (typeof nodeletId === 'undefined' || !nodeletId) {
				return;
			}
			const nodelet = nodelets.find((n) => n.id === nodeletId);
			if (!nodelet) {
				return;
			}
			const position =
				reactFlowInstance &&
				reactFlowInstance.screenToFlowPosition({
					x: event.clientX,
					y: event.clientY,
				});
			const newNode = {
				id: uuidv4(),
				type: 'node',
				position,
				data: {
					label: nodelet.name,
					nodeletId,
					config: buildDefaultConfig(nodelet),
				},
			};
			setNodes((nds) => nds.concat(newNode as Node));
		},
		[reactFlowInstance],
	);
	const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);
	const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
	const selectedNodelet = useMemo(() => nodelets.find((nodelet) => nodelet.id === selectedNode?.data.nodeletId), [selectedNode]);

	const onNodeClick = useCallback((_: MouseEvent, node: Node) => {
		setSelectedNode(node);
	}, []);
	useEffect(() => {
		if (!configOpened && (selectedNodelet?.configDefinitions || []).length) {
			setConfigOpened(true);
		} else {
			setConfigOpened(false);
		}
	}, [selectedNode]);
	return (
		<Flex className="flex-col flex-1">
			<Flex className="flex-row justify-between mx-10 my-5 align-middle">
				<Group>
					{isEditingName ? (
						<FocusTrap active={isEditingName}>
							<TextInput
								size="xs"
								value={workflowName}
								onChange={(e) => setWorkflowName(e.target.value)}
								onBlur={() => {
									setIsEditingName(false);
								}}
							></TextInput>
						</FocusTrap>
					) : (
						<div>{workflowName}</div>
					)}
					<IconPencil
						className="text-primary h-4 cursor-pointer"
						onClick={() => {
							setIsEditingName(true);
						}}
					/>
				</Group>
				<Flex direction={'row'} gap="md">
					<Button
						size="sm"
						className="h-7 gap-1"
						onClick={() => {
							updateWorkflow &&
								updateWorkflow(workflowId, {
									...workflow,
									name: workflowName,
									data: reactFlowInstance && reactFlowInstance.toObject(),
									category,
								} as IWorkflow).then(() => {
									refreshWorkflows();
									notifications.show({
										title: 'Save Successfully',
										message: '',
										icon: <IconCheck />,
										color: 'teal',
										autoClose: 1000,
									});
								});
						}}
					>
						<IconDeviceFloppy className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Save</span>
					</Button>
					<Button
						size="sm"
						className="h-7 gap-1"
						onClick={() => {
							if (category === IWorkflowCategory.Chatbot) {
								setChatOpened(true);
							} else {
								// window.ipcRenderer.executeAutomation(workflow?.id, workflow).then(() => {
								// 	// refreshConversations();
								// });
								open();
							}
						}}
					>
						{category === IWorkflowCategory.Chatbot ? (
							<IconBrandHipchat className="h-3.5 w-3.5" />
						) : (
							<IconPlayerPlay className="h-3.5 w-3.5" />
						)}
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{category === IWorkflowCategory.Chatbot ? 'Chat' : 'Run'}</span>
					</Button>
				</Flex>
			</Flex>
			<Divider />
			<div className="flex flex-1 relative">
				<aside className="w-38 py-4 flex flex-col ">
					{workflowNodelets.map((nodelet) => (
						<Nodelet nodelet={nodelet} key={nodelet.id} />
					))}
				</aside>
				<Divider orientation="vertical" />
				<div className="relative flex flex-1 reactflow-wrapper" ref={reactFlowWrapper}>
					<ReactFlow
						nodes={nodes.map((node) => {
							return {
								...node,
								type: 'internalNodelet',
							};
						})}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						className="absolute bottom-0 left-0 top-0 right-0"
						nodeTypes={nodeTypes}
						onNodeClick={onNodeClick}
						onPaneClick={() => {
							setConfigOpened(false);
						}}
						onDrop={onDrop}
						onInit={setReactFlowInstance}
						onDragOver={onDragOver}
					>
						<MiniMap />
						<Controls />
						<Background />
					</ReactFlow>
				</div>
				<Drawer
					opened={chatOpened}
					onClose={() => {
						setChatOpened(false);
					}}
					title="Chat"
					position="right"
					withOverlay={false}
					size="sm"
					styles={{
						inner: { right: 0, margin: '0.8rem' },
					}}
				>
					<ChatWorkflow
						workflow={
							{
								...workflow,
								data: reactFlowInstance && reactFlowInstance.toObject(),
							} as IWorkflow
						}
					/>
				</Drawer>
				<Drawer
					opened={configOpened}
					onClose={() => {
						setConfigOpened(false);
					}}
					title={`${selectedNodelet?.name} Configuration`}
					position="right"
					withOverlay={false}
					size="sm"
					styles={{
						inner: { right: 0, margin: '0.8rem' },
					}}
				>
					<Configuration
						key={selectedNodelet?.id}
						definitions={selectedNodelet?.configDefinitions || []}
						config={selectedNode?.data.config || {}}
						integrationConfig={integration?.config}
						style={{ padding: '20px 0' }}
						onChange={(config) => {
							const selectedNodeIndex = nodes.findIndex((node) => node.id === selectedNode?.id);
							setNodes([
								...nodes.slice(0, selectedNodeIndex),
								{
									...selectedNode,
									data: { ...selectedNode?.data, config },
								},
								...nodes.slice(selectedNodeIndex + 1),
							] as Node[]);
						}}
					/>
				</Drawer>
				<Modal opened={inputsModalOpened} size="lg" onClose={close} title="Run Automation">
					<RunAutomation workflow={{ ...workflow, data: { nodes, edges } }} />
				</Modal>
			</div>
		</Flex>
	);
}

export default FlowEdit;
