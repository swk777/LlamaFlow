import { AppContext } from '@/context/AppContext';
import { getNewState } from '@/utils/state';
import { ActionIcon, CloseButton, Flex, Group, HoverCard, Input, LoadingOverlay, Modal, Popover, Text } from '@mantine/core';
import { useDisclosure, useHover } from '@mantine/hooks';
import _get from 'lodash/get';
import { useContext, useState } from 'react';

import { WorkflowContext } from '@/context/WorkflowContext';
import { getRandomColor } from '@/utils/utils';
import { Integration } from '@/views/Integration';
import EditableText from '@/views/components/EditableText';
import { IconCheck, IconCirclePlus, IconExclamationCircle, IconSettings } from '@tabler/icons-react';
import { Handle, Node, Position, useReactFlow } from 'reactflow';
type Props = { data: any; id: string };

export default function InternalNode({ data, id }: Props) {
	const { nodelets } = useContext(AppContext);
	const { setNodes, getNodes } = useReactFlow();
	const [opened, setOpened] = useState(false);
	const [variables, setVariables] = useState(data?.config?.variables ?? {});
	const { hovered, ref } = useHover();
	const nodelet = nodelets.find((nodelet) => nodelet.id === data?.nodeletId);
	const hasConfiguration = !!(nodelet?.configDefinitions || []).length;
	const displayAttr = nodelet?.configDefinitions.find((definition) => definition.isDisplayed);
	const displayContent =
		displayAttr && _get(data?.config, `${displayAttr.fieldName}${displayAttr.displayPath ? '.' + displayAttr.displayPath : ''}`);
	const { inputs = [], outputs = [] } = nodelet || {};
	const [integrationOpened, { open, close }] = useDisclosure(false);
	const { validatesResult, onNodeClick } = useContext(WorkflowContext);
	const error = validatesResult.filter((result) => result.id === id);
	return (
		<>
			<Flex
				className="w-24 h-20 border bg-neutral-50 shadow-md rounded-sm  relative"
				direction={'column'}
				align={'center'}
				justify={'start'}
				ref={ref}
			>
				<CloseButton
					className="absolute"
					size="sm"
					style={{ top: -2, right: -2, zIndex: 1000, visibility: hovered ? 'visible' : 'hidden' }}
					onClick={(e) => {
						e.stopPropagation();
						setNodes(
							getNewState(getNodes(), (draft) => {
								return draft.filter((node) => node.id !== id);
							}) as Node<any>[],
						);
					}}
				/>

				<div className="w-full h-3 shrink-0" style={{ backgroundColor: getRandomColor(nodelet?.id ?? '') }}></div>
				<Flex direction={'column'} className="flex-1 overflow-hidden" align={'center'} justify={'center'}>
					<LoadingOverlay
						visible={hovered && hasConfiguration}
						loaderProps={{
							children: (
								<ActionIcon variant="subtle" aria-label="Settings" className="border-none">
									<IconSettings className="w-8 h-8 text-primary" />
								</ActionIcon>
							),
						}}
						overlayProps={{ blur: 4 }}
					/>
					<img src={nodelet?.image} className="w-6 h-6 mb-1" />
					{displayContent && (
						<Text fz={13} px={4} className="max-w-24 truncate text-gray-600 hover:text-clip">
							{displayContent}
						</Text>
					)}
				</Flex>
				<EditableText
					initialName={data.label}
					onChange={async (v: string) => {
						const nodes = getNodes();
						setNodes(
							getNewState(nodes, (draft) => {
								const currentNodeIndex = draft.findIndex((node) => node.id === id);
								const currentNode = nodes[currentNodeIndex];
								currentNode.data.label = v;
							}) as Node<any>[],
						);
					}}
					className="absolute w-36 flex-row flex-nowrap"
					style={{ bottom: -34 }}
					showElement={
						<Flex direction={'row'} align={'center'} justify={'center'} maw={144}>
							{(error || []).length !== 0 && (
								<HoverCard shadow="md">
									<HoverCard.Target>
										<IconExclamationCircle color="red" className="h-4" />
									</HoverCard.Target>
									<HoverCard.Dropdown>
										{(error || []).map((err) => (
											<Group
												onClick={(e) => {
													e.stopPropagation();
												}}
												key={err.type + err.fieldName}
											>
												<Text size="sm">{`・ ${err.type} field "${err.fieldName}" is required`}</Text>
												<ActionIcon variant="subtle" aria-label="Settings" size="sm">
													<IconSettings
														size={15}
														onClick={(e) => {
															if (err.type === 'Config') {
																const nodes = getNodes();
																const currentNodeIndex = nodes.findIndex((node) => node.id === id);
																const currentNode = nodes[currentNodeIndex];
																onNodeClick(e, currentNode);
															} else if (err.type === 'Integration') {
																open();
															}
														}}
													/>
												</ActionIcon>
											</Group>
										))}
									</HoverCard.Dropdown>
								</HoverCard>
							)}

							<Text fz="13" key={data?.label} className="truncate cursor-pointer hover:text-primary text-left " fw={600}>
								{data?.label}
							</Text>
						</Flex>
					}
				/>
			</Flex>
			{inputs.map((input, index) => (
				<Handle
					key={input.id}
					id={input.id}
					type="target"
					position={Position.Left}
					style={{
						top: `calc(100% / ${inputs.length + 1} * ${index + 1})`,
						width: '10px',
						height: '10px',
						backgroundColor: 'white',
						border: '1px solid hsl(208 80% 52%)',
						zIndex: 1000,
					}}
				>
					<div
						style={{
							position: 'absolute',
							transform: 'translate(-114%, -38%)',
							color: 'grey',
							fontSize: '12px',
						}}
					>
						{input.id}
					</div>
				</Handle>
			))}
			{outputs.map((output, index) => (
				<Handle
					key={output.id}
					id={output.id}
					type="source"
					position={Position.Right}
					style={{
						top: `calc(100% / ${outputs.length + 1} * ${index + 1})`,
						width: '10px',
						height: '10px',
						backgroundColor: 'white',
						border: '1px solid hsl(208 80% 52%)',
						zIndex: 1000,
					}}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<div
						style={{
							position: 'absolute',
							display: 'flex',
							transform: 'translate(12px, -38%)',
							color: 'grey',
							fontSize: '12px',
							alignItems: 'center',
						}}
					>
						{output.id}
						<Popover width={200} position="top" withArrow shadow="md" opened={opened} closeOnClickOutside>
							<Popover.Target>
								<IconCirclePlus
									size="13"
									className={` cursor-pointer ml-0.5 ${!variables[output.id] ? 'text-zinc-600' : 'text-primary'}`}
									onClick={() => setOpened(true)}
								/>
							</Popover.Target>
							<Popover.Dropdown>
								<Input.Wrapper label="Global Variable" description="use '{name}' as a placeholder in prompts">
									<CloseButton className="absolute" style={{ top: 10, right: 10 }} onClick={() => setOpened(false)} />
									<Flex align={'center'} pos="relative">
										<Input
											placeholder="name"
											value={variables[output.id]}
											onChange={(e) => setVariables({ ...variables, [output.id]: e.target.value })}
										/>
										<ActionIcon variant="filled" aria-label="Settings" size="sm" className="ml-3 mt-1">
											<IconCheck
												className="cursor-pointer"
												width={30}
												height={30}
												size={32}
												onClick={() => {
													const nodes = getNodes();
													const currentNodeIndex = nodes.findIndex((node) => node.id === id);
													const currentNode = nodes[currentNodeIndex];
													setNodes([
														...nodes.slice(0, currentNodeIndex),
														{
															...currentNode,
															data: { ...currentNode?.data, config: { ...currentNode?.data?.config, variables } },
														},
														...nodes.slice(currentNodeIndex + 1),
													] as Node[]);
													setOpened(false);
												}}
											/>
										</ActionIcon>
									</Flex>
								</Input.Wrapper>
							</Popover.Dropdown>
						</Popover>
					</div>
				</Handle>
			))}
			<Modal opened={integrationOpened} size="lg" onClose={close} title="Integration" onClick={(e) => e.stopPropagation()}>
				<Integration id={nodelet.id} />
			</Modal>
		</>
	);
}
