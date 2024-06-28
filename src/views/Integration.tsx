import { AppContext } from '@/context/AppContext';
import { IIntegration } from '@/type/integration';
import { Flex, ScrollArea } from '@mantine/core';
import { IconNotes } from '@tabler/icons-react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import classes from './Integration.module.css';
import IntegrationConfig from './IntegrationConfig';
import { LinksGroup } from './components/LinksGroup';

const getIntegrationsLinksData = (integrations: IIntegration[], integrationId: string) => [
	{
		label: 'AI Models',
		icon: IconNotes,
		initiallyOpened: true,
		links: integrations.map((integration) => ({
			id: integration.id,
			bold: integrationId === integration.id,
			label: integration.label,
			link: `/integration/${integration.id}`,
		})),
	},
];

export function Integration({ id }: { id?: string }) {
	const { integrations } = useContext(AppContext);
	const { integrationId = integrations[0].id } = useParams();
	const links = getIntegrationsLinksData(integrations, integrationId).map((item) => <LinksGroup {...item} key={item.label} />);
	return (
		<Flex direction={'row'}>
			{!id && (
				<nav className="w-44 border-r px-3 h-screen">
					<ScrollArea className={classes.links}>{links}</ScrollArea>
				</nav>
			)}
			<Flex className="flex-1">
				<IntegrationConfig id={id ?? integrationId} />
			</Flex>
		</Flex>
	);
}
