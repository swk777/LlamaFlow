import { AppContextProvider } from '@/context/AppContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import ChatConversation from './ChatConversation';
import ChooseWorkspace from './ChooseWorkspace';
import Conversations from './Conversations';
import { Dashboard } from './Dashboard';
import FlowEdit from './FlowEdit';
import { Integration } from './Integration';
import KnowledgeBase from './KnowledgeBase';
import KnowledgeBaseBoard from './KnowledgeBaseBoard';
import Workflow from './Workflow';

type Props = {};

export default function MainRouter({}: Props) {
	// const [settings, setSettings] = useState();
	// useEffect(() => {
	// 	window.ipcRenderer.invoke('get-global').then((res) => {
	// 		console.log(res);
	// 		setSettings(res);
	// 	});
	// }, []);
	const { workspace } = useWorkspace();
	return !workspace ? (
		<ChooseWorkspace />
	) : (
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
		</AppContextProvider>
	);
	{
		/* <ChooseWorkspace />; */
	}
}
