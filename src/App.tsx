import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppContextProvider } from '@/context/AppContext';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { ReactFlowProvider } from 'reactflow';
import '../app/globals.css';
import './App.css';
import ChatConversation from './views/ChatConversation';
import Conversations from './views/Conversations';
import { Dashboard } from './views/Dashboard';
import FlowEdit from './views/FlowEdit';
import { Integration } from './views/Integration';
import KnowledgeBase from './views/KnowledgeBase';
import KnowledgeBaseBoard from './views/KnowledgeBaseBoard';
import Workflow from './views/Workflow';

const theme = createTheme({
	/** Put your mantine theme override here */
});

function App() {
	return (
		<MantineProvider theme={theme}>
			<div className="flex">
				<AppContextProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Dashboard />}>
								<Route index element={<Workflow />} />
								<Route
									path="/workflow-edit/:workflowId"
									element={
										<ReactFlowProvider>
											<FlowEdit />
										</ReactFlowProvider>
									}
								/>
								<Route path="/integration/:integrationId?" element={<Integration />}></Route>

								<Route path="/chat" element={<Conversations />}>
									<Route path="/chat/:conversationId" element={<ChatConversation />} />
								</Route>
								<Route path="/knowledge-base/:id" element={<KnowledgeBase />} />
								<Route path="/knowledgeBaseBoard" element={<KnowledgeBaseBoard />} />
							</Route>
						</Routes>
					</BrowserRouter>
					{/* <UpdateElectron /> */}
				</AppContextProvider>
			</div>
			<Notifications position="top-right" />
		</MantineProvider>
	);
}

export default App;
