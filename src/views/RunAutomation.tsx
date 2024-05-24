import { AppContext } from '@/context/AppContext';
import Configuration from '@/node/config/Configuration';
import { NodeletCategory } from '@/type/nodelet';
import { IWorkflow } from '@/type/workflow';
import { Button, Card, Stack, Text } from '@mantine/core';
import { useContext, useMemo, useState } from 'react';
import { Node } from 'reactflow';

type Props = { nodes: Node[]; workflow: IWorkflow };

export default function RunAutomation({ nodes, workflow }: Props) {
	const { nodelets } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const [inputConfig, setInputConfig] = useState({});
	const inputNodes = useMemo(
		() =>
			nodes.filter((node) => {
				const nodelet = nodelets.find((nodelet) => nodelet.id === node.data.nodeletId);
				return nodelet?.category === NodeletCategory.Input;
			}),
		[nodes],
	);
	return (
		<Stack gap={'xs'}>
			{inputNodes.map((inputNode) => {
				const nodelet = nodelets.find((nodelet) => nodelet.id === inputNode.data.nodeletId);
				return (
					<Card shadow="sm" padding="xs" radius="xs" withBorder>
						<Text className="text-primary" fw={600} size="sm">
							{inputNode.data.label}
						</Text>
						<Configuration
							definitions={nodelet?.configDefinitions || []}
							config={inputConfig}
							style={{ padding: '20px 0' }}
							onChange={(newConfig) => {
								setInputConfig({ ...inputConfig, [inputNode.id]: newConfig });
							}}
						/>
					</Card>
				);
			})}
			<Button
				loading={loading}
				onClick={async () => {
					setLoading(true);
					try {
						await window.ipcRenderer.runAutomation(workflow?.id, inputConfig, workflow);
					} catch (error) {
						console.log(error);
					}
					setLoading(false);
				}}
			>
				Run
			</Button>
		</Stack>
	);
}
