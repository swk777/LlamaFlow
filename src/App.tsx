import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '../app/globals.css';
import './App.css';
import { WorkspaceProvider } from './context/WorkspaceContext';
import MainRouter from './views/MainRouter';

const theme = createTheme({
	/** Put your mantine theme override here */
});

function App() {
	return (
		<MantineProvider theme={theme}>
			<WorkspaceProvider>
				<div className="flex">
					<MainRouter />
				</div>
			</WorkspaceProvider>
			<Notifications position="top-right" />
		</MantineProvider>
	);
}

export default App;
