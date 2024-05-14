import { Button, Center, Container, Space, Text } from '@mantine/core';
import { IconFolderOpen } from '@tabler/icons-react';

type Props = {};

export default function ChooseWorkspace({}: Props) {
	const handleSelectFolder = () => {
		window.ipcRenderer.openDialog();
	};

	return (
		<Container className="mb-10">
			<Center>
				<IconFolderOpen className="h-16 w-16 text-primary" />
			</Center>
			<Space h="md" />
			<Button onClick={handleSelectFolder}>Select Workspace Folder</Button>
			<Space h="md" />

			<Text className="text-gray-500 px-24 py-3 text-left" size="sm">
				Please select a folder for your workspace: The folder you choose will be used to store all your work files and data. Make sure to
				select a secure location that is easy to access and manage for your projects in the future.
			</Text>
		</Container>
	);
}
