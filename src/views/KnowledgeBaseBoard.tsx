import { AppContext } from '@/context/AppContext';
import { Card, FileButton, Flex, SimpleGrid, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCloudUpload } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import classes from './KnowledgeCard.module.css';
import AddKnowledgeModal from './components/AddKnowledgeModal';
import { KnowledgeCard } from './components/KnowledgeCard';

type Props = {};

export default function KnowledgeBaseBoard({}: Props) {
	const { knowledgeBases } = useContext(AppContext);
	const [opened, { open, close }] = useDisclosure(false);
	const [files, setFiles] = useState<File[]>([]);
	return (
		<>
			<SimpleGrid
				cols={{ base: 2, sm: 3, lg: 5 }}
				spacing={{ base: 10, sm: 'xl' }}
				verticalSpacing={{ base: 'md', sm: 'xl' }}
				className="px-8 py-8"
			>
				<FileButton
					onChange={(files) => {
						setFiles(files);
						open();
					}}
					accept=".pdf"
					multiple
				>
					{(props) => (
						<Card withBorder padding="lg" className={classes.card} {...props}>
							<Flex direction={'column'} align="center" justify="space-between" gap="xs" mt="md">
								<IconCloudUpload className="text-primary" size="48" />
								<Text fw={600} c="grey">
									Add Files
								</Text>
							</Flex>
						</Card>
					)}
				</FileButton>
				{knowledgeBases.map((knowledgeBase) => (
					<KnowledgeCard knowledgeBase={knowledgeBase} key={knowledgeBase.id} />
				))}
			</SimpleGrid>
			<AddKnowledgeModal opened={opened} close={close} files={files} />
		</>
	);
}
