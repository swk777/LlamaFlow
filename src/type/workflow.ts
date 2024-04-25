export enum IWorkflowStatus {
  Draft = "Draft",
  Published = "Published",
}
export interface IWorkflow {
  id: string;
  name: string;
  category: IWorkflowStatus;
  lastModified: string;
  data?: any;
}
