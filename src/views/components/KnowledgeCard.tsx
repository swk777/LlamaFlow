import { IKnowledgeBase } from '@/type/knowledgeBase';
import { Card, Flex, Text } from '@mantine/core';
import { IconFiles } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import classes from '../KnowledgeCard.module.css';

type Props = {
	knowledgeBase: IKnowledgeBase;
};

export function KnowledgeCard({ knowledgeBase }: Props) {
	let navigate = useNavigate();
	return (
		<Card
			withBorder
			padding="lg"
			className={classes.card}
			onClick={() => {
				navigate(`/knowledge-base/${knowledgeBase.id}`);
			}}
		>
			<Flex justify="left" gap="xs">
				<IconFiles className="text-primary" />
				<Text fw={600} truncate="end">
					{knowledgeBase.name}
				</Text>
			</Flex>
			<Text mt="sm" mb="xs" c="dimmed" fz="xs" className="text-left" ml="6">
				56 km this month • 17% improvement compared to last month • 443 place in global scoreboard
			</Text>
			{/* <Divider /> */}
			<Card.Section className={classes.footer}>
				<Flex direction={'row'}>
					<Text size="xs" className="pr-1">
						{knowledgeBase.fileList.length}
					</Text>
					<Text size="xs" c="dimmed">
						files
					</Text>
				</Flex>
				<Flex direction={'row'}>
					<Text size="xs" className="pr-1">
						{knowledgeBase.fileList.length * 1000}
					</Text>
					<Text size="xs" c="dimmed">
						words
					</Text>
				</Flex>
			</Card.Section>
		</Card>
	);
}
