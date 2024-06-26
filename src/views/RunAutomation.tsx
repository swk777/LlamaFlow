import { AppContext } from '@/context/AppContext';
import Configuration from '@/node/config/Configuration';
import { NodeletCategory } from '@/type/nodelet';
import { IWorkflow } from '@/type/workflow';
import { Alert, Button, Card, Group, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useContext, useMemo, useState } from 'react';
import { Node } from 'reactflow';

type Props = { nodes?: Node[]; workflow: IWorkflow };

export default function RunAutomation({ workflow }: Props) {
	const { nodelets } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const [inputConfig, setInputConfig] = useState({});
	const [execution, setExecution] = useState(null);
	const inputNodes = useMemo(
		() =>
			(workflow?.data?.nodes || []).filter((node) => {
				const nodelet = nodelets.find((nodelet) => nodelet.id === node.data.nodeletId);
				return nodelet?.category === NodeletCategory.Input;
			}),
		[workflow],
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
						setExecution(await window.ipcRenderer.runAutomation(workflow?.id, inputConfig, workflow));
					} catch (error) {
						console.log(error);
					}
					setLoading(false);
				}}
			>
				Run
			</Button>
			{(execution?.globalContext?.errors || []).length !== 0 && (
				<Alert variant="light" color="red" title="Execution Error" icon={<IconInfoCircle />}>
					{(execution?.globalContext?.errors || []).map((err) => {
						return (
							<Group gap="sm" key={err?.nodeName + err?.message}>
								<Text fw={600}>{err?.nodeName}:</Text>
								<Text size="md">{err?.message ?? ''}</Text>
							</Group>
						);
					})}
				</Alert>
			)}
			{execution && (execution?.globalContext?.errors || []).length === 0 && (
				<Alert className="p-1" variant="light" color="green" title="Execute Successfully" icon={<IconInfoCircle />}></Alert>
			)}
			{Object.values(execution?.globalContext?.outputMessage || []).map((res: { name: string; content: string }) => {
				return (
					<Card shadow="sm" padding="xs" radius="xs" withBorder>
						<Text className="text-primary" fw={600} size="sm">
							{res.name}
						</Text>
						<Text size="sm">{res.content}</Text>
					</Card>
				);
			})}
		</Stack>
	);
}
