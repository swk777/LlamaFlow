import { Box, Button, Group, Modal, Select, Table, TextInput, Textarea } from '@mantine/core';
import pick from 'ramda/src/pick';

import { EmbeddingModelsSelectOptions, OpenAIEmbeddingModels } from '@/constants/models';
import { AppContext } from '@/context/AppContext';
import { IKnowledgeBase } from '@/type/knowledgeBase';
import { useForm } from '@mantine/form';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = { opened: boolean; close: () => void; files: File[] };

export default function AddKnowledgeModal({ opened, close, files }: Props) {
	const { refreshKnowledgeBase, integrations } = useContext(AppContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			description: '',
			model: OpenAIEmbeddingModels['text-embedding-3-small'],
		},
	});
	const rows = useMemo(
		() =>
			files.map((file) => (
				<Table.Tr key={file.name}>
					<Table.Td w="80%" align="left">
						{file.name}
					</Table.Td>
					<Table.Td align="left">{file.lastModified}</Table.Td>
				</Table.Tr>
			)),
		[files],
	);
	return (
		<Modal opened={opened} onClose={close} title="New Knowledge Base">
			<Box maw={520} mx="auto" p={10}>
				<form onSubmit={form.onSubmit((values) => console.log(values))}>
					<TextInput withAsterisk label="Name" {...form.getInputProps('name')} />
					<Textarea label="Description" {...form.getInputProps('description')} />
					<Select
						label="Embedding Model"
						placeholder="Pick value"
						data={EmbeddingModelsSelectOptions}
						defaultValue={OpenAIEmbeddingModels['text-embedding-3-small']}
						{...form.getInputProps('model')}
					/>
					<div className="mt-6 max-h-60 overflow-y-auto">
						<Table striped>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>File Name</Table.Th>
									<Table.Th>Last Modified</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>{rows}</Table.Tbody>
						</Table>
					</div>
					<Group justify="flex-end" mt="md">
						<Button
							type="submit"
							loading={loading}
							onClick={() => {
								setLoading(true);
								const { name, description, model } = form.getValues();
								window.ipcRenderer
									.addKnowledgeBase(
										name,
										description,
										model,
										files.map((file) => pick(['name', 'path', 'type', 'lastModified'], file)),
									)
									.then((knowledgeBase: IKnowledgeBase) => {
										refreshKnowledgeBase();
										setLoading(false);
										navigate(`/knowledge-base/${knowledgeBase.id}`);
									})
									.catch(() => {
										setLoading(false);
									});
							}}
						>
							Submit
						</Button>
					</Group>
				</form>
			</Box>
		</Modal>
	);
}
