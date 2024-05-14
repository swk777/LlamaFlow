import { AppContext } from '@/context/AppContext';
import { Button, Divider, FileButton, Flex, LoadingOverlay } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import pick from 'ramda/src/pick';
import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FileTable from './components/FileTable';

type Props = {};

export default function KnowledgeBase({}: Props) {
	const { id = '' } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { knowledgeBases, refreshKnowledgeBase } = useContext(AppContext);
	const knowledgeBase = knowledgeBases.find((kb) => kb.id === id);
	const { fileList = [] } = knowledgeBase || {};

	return (
		<Flex direction={'column'}>
			<Flex h="60px" align="center" justify="space-between" className="px-8 py-2">
				<IconChevronLeft size="30" className="text-primary" onClick={() => navigate(-1)} />
				<FileButton
					onChange={(files) => {
						setLoading(true);
						window.ipcRenderer
							.addDocuments(
								files.map((file) => pick(['name', 'path', 'type', 'lastModified'], file)),
								id,
							)
							.then(() => {
								refreshKnowledgeBase();
								setLoading(false);
							})
							.catch(() => {
								setLoading(false);
							});
					}}
					accept=".pdf,.md,.txt,.json,.html,.csv,.doc,.docx,.ppt,.pptx"
					multiple
				>
					{(props) => <Button {...props}>Add Documents</Button>}
				</FileButton>
			</Flex>
			<Divider />
			<Flex className="flex-1 p-10">
				<LoadingOverlay visible={loading} zIndex={1000} />
				<FileTable files={fileList} />
			</Flex>
		</Flex>
	);
}
