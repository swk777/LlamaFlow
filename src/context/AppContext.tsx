import {
  ReactElement,
  useState,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { DefaultData } from "../constants/initialData";
import { IWorkflow } from "../type/workflow";
import { Nodelet } from "../type/nodelet";
import { IKnowledgeBase } from "@/type/knowledgeBase";

interface IProviderProps {
  children: ReactElement;
}

interface IAppContext {
  integrations: any[];
  workflows: IWorkflow[];
  nodelets: Nodelet[];
  knowledgeBases: IKnowledgeBase[];
  setWorkflows?: (newData: IWorkflow[]) => void;
  setNodelets?: (newData: Nodelet[]) => void;
  setKnowledgeBases?: (newData: IKnowledgeBase[]) => void;
  updateWorkflow?: (workflowId: string, newData: IWorkflow) => void;
  updateIntegration?: (integrationId: string, newData: any) => void;
  refreshKnowledgeBase: () => void;
  refreshWorkflow: () => void;
}
export const AppContext = createContext<IAppContext>({
  integrations: DefaultData.integrations,
  workflows: DefaultData.workflows,
  nodelets: DefaultData.nodelets,
  knowledgeBases: DefaultData.knowledgeBases,
});

export function AppContextProvider(props: IProviderProps): ReactElement {
  const [workflows, setWorkflows] = useState(
    DefaultData.workflows as IWorkflow[]
  );
  const [knowledgeBases, setKnowledgeBases] = useState(
    DefaultData.knowledgeBases as IKnowledgeBase[]
  );
  const [integrations, setIntegrations] = useState(
    DefaultData.integrations as any[]
  );
  const [nodelets, setNodelets] = useState(DefaultData.nodelets as Nodelet[]);
  const { children } = props;
  const updateWorkflow = useCallback(
    async (workflowId: string, newData: IWorkflow) => {
      console.log(workflows);
      const workflowIdx = workflows.findIndex((wf) => wf.id === workflowId);
      console.log(workflowIdx);
      if (workflowIdx === -1) {
        await window.ipcRenderer.addWorkflow(newData);
        await refreshWorkflow();
      } else {
        const workflows = await window.ipcRenderer.saveWorkflows(
          workflowIdx,
          newData
        );
        setWorkflows(workflows);
        // await refreshWorkflow();
      }
    },
    [workflows]
  );
  const updateIntegration = useCallback(
    async (integrationId: string, newData) => {
      const IntegrationIdx = integrations.findIndex(
        (wf) => wf.id === integrationId
      );
      // if (IntegrationIdx === -1) {
      //   await window.ipcRenderer.addWorkflow(newData);
      //   await refreshWorkflow();
      // } else {
      const newIntegrations = await window.ipcRenderer.saveIntegration(
        IntegrationIdx,
        newData
      );
      setIntegrations(newIntegrations);
      // await refreshWorkflow();
      // }
    },
    [workflows]
  );
  const refreshKnowledgeBase = useCallback(() => {
    window.ipcRenderer.getKnowledgeBases().then(setKnowledgeBases);
  }, []);
  const refreshWorkflow = async () => {
    setWorkflows(await window.ipcRenderer.getWorkflows());
  };
  const refreshIntegrations = async () => {
    setIntegrations(await window.ipcRenderer.getIntegrations());
  };
  useEffect(() => {
    window.ipcRenderer.getNodelets().then(setNodelets);
    refreshWorkflow();
    refreshKnowledgeBase();
    refreshIntegrations();
  }, []);
  return (
    <AppContext.Provider
      value={{
        integrations,
        workflows,
        nodelets,
        knowledgeBases,
        setWorkflows,
        setNodelets,
        setKnowledgeBases,
        refreshWorkflow,
        updateWorkflow,
        updateIntegration,
        refreshKnowledgeBase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
