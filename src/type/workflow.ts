export enum WorkflowStatus {
  Draft = "Draft",
  Published = "Published",
}
export interface Workflow {
  id: string;
  name: string;
  category: WorkflowStatus;
  lastModified: string;
  data?: any;
}
