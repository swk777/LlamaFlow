import { AppContext } from '@/context/AppContext';
import { Button, Container, Flex, Space, Stack, Table, Text } from '@mantine/core';
import { IconArticle, IconTrash } from '@tabler/icons-react';
import { useContext } from 'react';

type Props = {};

export default function Extensions({}: Props) {
	const { extensions = [], refreshExtensions } = useContext(AppContext);
	return (
		<main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="flex items-center mt-3">
				<div className="ml-auto flex items-center gap-2 mt-4">
					<Button
						size="sm"
						onClick={async () => {
							await window.ipcRenderer.refreshExtensions();
							refreshExtensions();
						}}
					>
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Refresh Extensions</span>
					</Button>
				</div>
			</div>
			<Space h="sm" />
			<Space h="sm" />
			{extensions.length === 0 ? (
				<Container>
					<Stack justify="center" align="center">
						<IconArticle className="text-gray-600 w-8 h-8" />
						<Text fw={500} className="text-gray-400">
							No Extension
						</Text>
					</Stack>
				</Container>
			) : (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className="hidden w-[100px] sm:table-cell">
								<span className="sr-only">Image</span>
							</Table.Th>
							<Table.Th>Name</Table.Th>
							<Table.Th className="text-center">Path</Table.Th>
							<Table.Th>
								<span className="sr-only">Actions</span>
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{(extensions || []).map(({ extensionFolderName, config }, idx) => (
							<Table.Tr key={config.id}>
								<Table.Td className="font-medium hidden sm:table-cell w-1/15" height={50}>
									{idx + 1}.
								</Table.Td>
								<Table.Td className="font-medium w-1/3 text-left">{config.name}</Table.Td>
								<Table.Td>{'/' + extensionFolderName}</Table.Td>
								<Table.Td>
									<Flex className="flex-row" gap="md">
										<IconTrash size={16} onClick={() => {}} className="text-primary cursor-pointer" />
									</Flex>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			)}
		</main>
	);
}
