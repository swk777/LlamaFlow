import { createContext, useContext, useEffect, useState } from 'react';

const WorkspaceContext = createContext({});

export const WorkspaceProvider = ({ children }) => {
	const [workspace, setWorkspace] = useState(null);

	useEffect(() => {
		async function fetchWorkspace() {
			const savedWorkspace = await window.ipcRenderer.getWorkSpace();
			if (savedWorkspace) {
				setWorkspace(savedWorkspace);
			}
		}
		fetchWorkspace();

		// 设置监听器
		window.ipcRenderer.on('workspace-set', fetchWorkspace);

		// // 清理监听器
		// return () => {
		// 	window.ipcRenderer.removeListener('workspace-set', fetchWorkspace);
		// };
	}, []);
	return <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => useContext(WorkspaceContext);
