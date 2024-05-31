import { Card, FileButton, Flex, Modal, SimpleGrid, Text } from '@mantine/core';
import { IconBrandYoutube, IconFile } from '@tabler/icons-react';
import { useState } from 'react';

type Props = { opened: boolean; close: () => void };

export default function AddKnowledgeModal({ opened, close }: Props) {
	const [files, setFiles] = useState<File[]>([]);
	return (
		<Modal opened={opened} onClose={close} title="New Knowledge Base" size="lg" centered>
			<SimpleGrid cols={{ xs: 3, sm: 3, md: 3, lg: 4, xl: 5 }} spacing={{ base: 10, sm: 'xl' }} className="px-8 py-8 auto-rows-min">
				<FileButton
					onChange={(files) => {
						setFiles(files);
						// open();
					}}
					accept=".pdf,.md,.txt,.json,.html,.csv,.doc,.docx,.ppt,.pptx"
					multiple
				>
					{(props) => (
						<Card withBorder w={100} className="cursor-pointer" {...props}>
							<Flex direction={'column'} align="center" justify="space-between" gap="xs">
								<IconFile className="text-primary" size="30" />
								<Text fw={600} c="grey" size="md">
									Files
								</Text>
							</Flex>
						</Card>
					)}
				</FileButton>
				<Card withBorder w={100} className="cursor-pointer">
					<Flex direction={'column'} align="center" justify="space-between" gap="xs">
						<IconBrandYoutube className="text-primary" size="30" />
						<Text fw={600} c="grey" size="md">
							Youtube
						</Text>
					</Flex>
				</Card>
			</SimpleGrid>
		</Modal>
	);
}
