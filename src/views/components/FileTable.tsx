import { Table } from '@mantine/core';
import { format } from 'date-fns';

type Props = { files: File[] };

export default function FileTable({ files }: Props) {
	const rows = files.map((file) => (
		<Table.Tr key={file.name}>
			<Table.Td w="30%" align="left">
				{file.name}
			</Table.Td>
			<Table.Td align="left">{file.path}</Table.Td>
			<Table.Td align="left">{format(new Date(file.lastModified), 'yyyy-MM-dd hh:mm a')}</Table.Td>
			{/* <Table.Td align="left">{`element.mass`}</Table.Td> */}
		</Table.Tr>
	));
	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>File Name</Table.Th>
					<Table.Th>File Path</Table.Th>
					<Table.Th>Last Modified</Table.Th>
					{/* <Table.Th>Actions</Table.Th> */}
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{rows}</Table.Tbody>
		</Table>
	);
}
