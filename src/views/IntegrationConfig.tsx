import { AppContext } from '@/context/AppContext';
import Configuration from '@/node/config/Configuration';
import { Button, Flex } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useContext, useState } from 'react';
type Props = { id: string };

export default function IntegrationConfig({ id }: Props) {
	console.log(id);
	const { integrations, updateIntegration } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const integration = integrations.find((i) => i.id === id) || integrations[0];
	const [config, setConfig] = useState(integration?.config || {});
	return (
		<Flex className="flex-1 py-4 px-10" direction={'column'}>
			<Configuration
				key={id}
				definitions={integration?.configDefinitions || []}
				config={integration?.config || {}}
				style={{ padding: '20px 0' }}
				onChange={(newConfig) => {
					setConfig(newConfig);
				}}
			/>
			<Button
				variant="filled"
				size="sm"
				className="mt-3 w-20"
				loading={loading}
				onClick={() => {
					setLoading(true);
					updateIntegration &&
						updateIntegration(integration?.id, {
							...integration,
							config,
						}).then(() => {
							setLoading(false);
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
				Save
			</Button>
		</Flex>
	);
}
