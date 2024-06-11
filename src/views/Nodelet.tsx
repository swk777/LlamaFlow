import { AppContext } from '@/context/AppContext';
import { INodelet } from '@/type/nodelet';
import { checkIntegration } from '@/utils/utils';
import { Avatar, Button, LoadingOverlay, Modal, Text } from '@mantine/core';
import { useDisclosure, useHover } from '@mantine/hooks';
import { useContext } from 'react';
import { Integration } from './Integration';

type Props = { nodelet: INodelet };

export default function Nodelet({ nodelet }: Props) {
	const { hovered, ref } = useHover();
	const { integrations } = useContext(AppContext);
	const [opened, { open, close }] = useDisclosure(false);
	const needIntegration = nodelet?.integration && checkIntegration(nodelet, integrations);
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeId: string) => {
		event.dataTransfer.setData('application/reactflow', nodeId);
		event.dataTransfer.effectAllowed = 'move';
	};
	return (
		<div
			key={nodelet.id}
			onDragStart={(event) => onDragStart(event, nodelet.id)}
			draggable={!needIntegration}
			ref={ref}
			className="h-12 px-2 flex-row max-w-52 flex items-center border-b hover:bg-gray-100 cursor-pointer relative"
		>
			<Avatar color="blue" radius="sm" className="w-10 h-10">
				<img src={nodelet.image} className="w-5" />
			</Avatar>
			<div className="text-sm pl-2 truncate overflow-x-hidden font-semibold">{nodelet.name}</div>
			{needIntegration && (
				<LoadingOverlay
					visible={hovered}
					loaderProps={{
						children: (
							<Button
								variant="default"
								className="border-none"
								onClick={() => {
									open();
								}}
							>
								<Text className="text-primary font-bold">Go To Settings</Text>
							</Button>
						),
					}}
					overlayProps={{ blur: 4 }}
				/>
			)}
			<Modal opened={opened} size="lg" onClose={close} title="Integration">
				<Integration id={nodelet.id} />
			</Modal>
		</div>
	);
}
