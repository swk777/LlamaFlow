import {
  ReactElement,
  useState,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { DefaultData } from "../constants/initialData";
import { Workflow } from "../type/workflow";
import { Nodelet } from "../type/nodelet";

interface IProviderProps {
  children: ReactElement;
}

interface IAppContext {
  workflows: Workflow[];
  nodelets: Nodelet[];
  setWorkflows?: (newData: Workflow[]) => void;
  setNodelets?: (newData: Nodelet[]) => void;
  updateWorkflow?: (workflowId: string, newData: Workflow) => void;
}
export const AppContext = createContext<IAppContext>({
  workflows: DefaultData.workflows,
  nodelets: DefaultData.nodelets,
});

export function AppContextProvider(props: IProviderProps): ReactElement {
  const [workflows, setWorkflows] = useState(
    DefaultData.workflows as Workflow[]
  );
  const [nodelets, setNodelets] = useState(DefaultData.nodelets as Nodelet[]);
  const { children } = props;
  const updateWorkflow = useCallback(
    (workflowId: string, newData: Workflow) => {
      const workflowIdx = workflows.findIndex((wf) => wf.id === workflowId);
      const newWorkflows = [
        ...workflows.slice(0, workflowIdx),
        newData,
        ...workflows.slice(workflowIdx + 1),
      ];
      setWorkflows(newWorkflows);
      window.ipcRenderer.saveWorkflows(workflowIdx, newData);
    },
    []
  );
  useEffect(() => {
    window.ipcRenderer.getNodelets().then(setNodelets);
    window.ipcRenderer.getWorkflows().then(setWorkflows);
  }, []);
  return (
    <AppContext.Provider
      value={{ workflows, nodelets, setWorkflows, setNodelets, updateWorkflow }}
    >
      {children}
    </AppContext.Provider>
  );
}
