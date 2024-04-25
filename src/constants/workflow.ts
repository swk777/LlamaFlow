import { IWorkflowStatus } from "@/type/workflow";
export const getInitialWorkflow = (id: string) => ({
  id,
  name: "New Workflow" + Math.random(),
  category: IWorkflowStatus.Draft,
  lastModified: "2023-07-12 10:42 AM",
  data: {
    nodes: [],
    edges: [],
  },
});
